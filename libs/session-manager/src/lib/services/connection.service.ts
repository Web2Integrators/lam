import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { cloneDeep, isUndefined } from 'lodash';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  UnaryFunction,
  empty,
  interval,
  of,
  pipe,
  combineLatest,
  Subject,
  from,
} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  mergeMap,
  switchMap,
  take,
  takeUntil,
  tap,
  timeout,
  withLatestFrom,
  endWith,
  startWith,
  shareReplay,
} from 'rxjs/operators';

import { HttpProgressService } from './../http-progress.service';
import { ModalService } from '../common/modal-dialogs/modal.service';
import { extractErrorName, handleBackendError } from '../common/util/connection-utils';
import { LogService, Logger } from '../log/log.service';
import { BackendError } from '../pde/pde-types';
import { PdeState, resetClientSession } from '../pde/state/pde-state';
import { BackendVersionService } from '../backend-version/backend-version.service';
import { filterResources } from './resource-utils';
import {
  HeartbeatResponse,
  LoginCredentials,
  MachineResource,
  Resource,
  Session,
  BackendConfigOptions,
  MachineConfiguration,
  HostImage,
  PMImage,
  ConfigurationResponse,
} from './types';
import { truthy } from '../common/util/rx-utils';
import { ElectronService } from '../electron.service';

export enum WizardStep {
  Session,
  Login,
  Arbitration,
  Complete,
}

export enum ResetConnectionMode {
  Normal,
  FatalError,
}

export enum ConnectionErrorCode {
  sessionIDNotFound = 'SessionIDNotFound',
  ctuWorkersUnavailable = 'CTUWorkersUnavailable',
  userLoginFailed = 'UserLoginFailed',
  invalidBackendVersion = 'InvalidBackendVersion',
  unknown = 'Unknown',
}

const arbitrationTimeout = 60 * 1000;
const backendPort = '18072';
const openSessionBody = {
  clientname: 'PDE Client',
  worker: {
    type: 'ctu',
    window: 'hide',
    launcher: 'hide',
  },
};
const MINIMUM_CTU_VERSION = '1.0';

interface ImageOptions {
  imageName: string;
  optionName: string;
  optionValue: string;
}

export type InvalidState = 'PENDING' | undefined;

/** Get the name of the resource lock (e.g. "PMxRecipe") from the name (e.g. "PMx") */
const getResourceLockName = (resourceName: string) => `${resourceName}Recipe`;

/** Determine whether the resource name is a process module and strip undefined from the type. */
export const isProcessModule = (resourceName?: string): boolean => {
  return !!resourceName && resourceName.startsWith('PM');
};

/**
 * Get the backend configuration options (dynamic feature guards) from a machine configuration.
 * Rules:
 * 1. arbitrationEnabled is true iff ("if and only if"):
 *  - String(imageOptions.HostImage.RecipeEditorArbitration) is not "Disable" (case-insensitive).
 * 2. endpointEditorEnabled is true iff:
 *  - resourceName is not an empty string, and
 *  - imageOptions.PM#Image.OESType is defined, and
 *  - String(imageOptions.PM#Image.OESType) is not "None" (case-insensitive).
 * 3. hydraEditorEnabled is true iff:
 *  - resourceName is not an empty string, and
 *  - imageOptions.PM#Image.HydraControllerInstalled is truthy, and
 *  - String(imageOptions.PM#Image.HydraControllerMode) is "Enable" (case-insensitive).
 * @param config The machine configuration object.
 */
export function extractBackendConfig(
  config: MachineConfiguration | InvalidState,
  resourceName: string,
): BackendConfigOptions | InvalidState {
  if (!config || config === 'PENDING') {
    return config;
  }
  const hostImage = config.imageOptions.HostImage as HostImage;
  let endpointEditorEnabled: boolean = false;
  let hydraEditorEnabled: boolean = false;
  if (isProcessModule(resourceName)) {
    const pmOpts = config.imageOptions[`${resourceName}Image`] as PMImage;
    if (!pmOpts) {
      throw new Error(`Options not found in machine configuration for resource "${resourceName}"`);
    }
    const oesType: string | undefined = pmOpts.OESType;
    endpointEditorEnabled = !isUndefined(oesType) && String(oesType).toLowerCase() !== 'none';
    const hydraControllerInstalled: boolean = !!pmOpts.HydraControllerInstalled;
    const hcmEnabled: boolean = String(pmOpts.HydraControllerMode).toLowerCase() === 'enable';
    hydraEditorEnabled = hydraControllerInstalled && hcmEnabled;
  }
  return {
    arbitrationEnabled: String(hostImage.RecipeEditorArbitration).toLowerCase() !== 'disable',
    endpointEditorEnabled,
    hydraEditorEnabled,
  };
}

/**
 * Service to manage the session, login, arbitration, etc.
 */
@Injectable({
  providedIn: 'root',
})
export class ConnectionService implements OnDestroy {
  private readonly log: Logger;
  private _wizardStep = new BehaviorSubject<WizardStep>(WizardStep.Session);
  wizardStep: Observable<WizardStep> = this._wizardStep.asObservable();
  resourceList = new BehaviorSubject<MachineResource[]>([]);
  sessionError = new BehaviorSubject<boolean>(false);
  loginError = new BehaviorSubject<boolean>(false);
  heartbeat?: Subscription;
  ctuUrl = new BehaviorSubject<string | undefined>(undefined);
  session?: Session;

  /** The name of the current focused/locked resource. Includes PM ("PMx") and non-PM resources. */
  resourceName = new BehaviorSubject<string>('');

  /** The latest config object received from the backend or an interim state. */
  backendConfigOptions = new BehaviorSubject<BackendConfigOptions | InvalidState>(undefined);

  /** The URL for the 2300 backend HTTP API. */
  backendUrl = new BehaviorSubject<string | undefined>(undefined);

  private heartbeatMessageOpen: boolean = false;

  /** Emits the latest backend config once and completes when subscribed to. */
  private latestBackendConfig: Observable<BackendConfigOptions | undefined>;
  hasBackendConfig: Observable<boolean>;

  private unsubscribe = new Subject<void>();

  constructor(
    private http: HttpClient,
    logService: LogService,
    private backendVersionService: BackendVersionService,
    private store: Store<PdeState>,
    private modal: ModalService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private electron: ElectronService,
  ) {
    this.log = logService.createLogger('ConnectionService');

    this.latestBackendConfig = this.backendConfigOptions.pipe(
      filter(result => result !== 'PENDING'),
      take(1),
      map(result => result as BackendConfigOptions | undefined),
    );

    const machineConfig = this.backendUrl.pipe(
      distinctUntilChanged(),
      switchMap(url => (url ? this.getMachineConfig(url) : of(undefined))),
    );
    combineLatest(machineConfig, this.resourceName, extractBackendConfig)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(this.backendConfigOptions);

    this.hasBackendConfig = this.backendConfigOptions.pipe(
      filter(result => result !== undefined && result !== 'PENDING'),
      mapTo(true),
      shareReplay(1),
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Update the state of the wizard.
   */
  nextWizardStep(step: WizardStep) {
    this._wizardStep.next(step);
  }

  /**
   * Initialize the connection to the server. Returns an observable that will indication when
   * connection setup is complete.
   *
   * @param notifier A notifier that the caller can use to cancel subscriptions
   * @param address The optional address (may be set in a query param)
   * @param resource The optional resource identifier (may be set in a query param)
   */
  initializeConnection(notifier: Observable<any>, address?: string, resource?: string) {
    return from(this.electron.getEnvironment()).pipe(
      map((electronEnv?: Environment) => !!electronEnv && electronEnv.uiMode === UiMode.Embedded),
      tap((isEmbedded: boolean) => {
        if (!isEmbedded) {
          // If the address is given, attempt to connect automatically. Otherwise, start the wizard.
          if (address) {
            this.openSession(address);
          } else {
            this.nextWizardStep(WizardStep.Session);
          }
          // If the resource is given, attempt to lock it automatically after login.
          if (resource) {
            this.wizardStep
              .pipe(
                takeUntil(notifier),
                filter(step => step === WizardStep.Arbitration),
                take(1),
                takeUntil(this.unsubscribe),
              )
              .subscribe(_ => this.getResourceLock(resource));
          }
        }
      }),
      switchMap((isEmbedded: boolean) =>
        isEmbedded
          ? of(true)
          : this.wizardStep.pipe(
              map(step => step === WizardStep.Complete),
              distinctUntilChanged(),
              takeUntil(notifier),
            ),
      ),
    );
  }

  /**
   * Open the session with the server.
   *
   * @param address The address specified by the user for the server
   */
  openSession(address: string) {
    this.sessionError.next(false);
    let fullAddress = address;
    if (!fullAddress.startsWith('http')) {
      fullAddress = 'http://' + fullAddress;
    }
    const nextBackendUrl: string = `${fullAddress}:${backendPort}`;
    this.http
      .post<Session>(`${nextBackendUrl}/sessionmanager/v3/opensession`, openSessionBody)
      .pipe(
        timeout(arbitrationTimeout),
        map(session => ({
          session,
          ctuUrl: `${fullAddress}:${session.workerPort}`,
        })),
        // Only set backend URL after opensession succeeds, e.g. to not get machine config eagerly:
        tap(() => this.backendUrl.next(nextBackendUrl)),
        tap(conn => this.ctuUrl.next(conn.ctuUrl)),
        switchMap(conn => {
          return this.backendVersionService.getCTUVersion(conn.ctuUrl).pipe(
            switchMap(version => {
              // We lose the patch version with parse float but we don't care about that..
              if (!version || parseFloat(version) < parseFloat(MINIMUM_CTU_VERSION)) {
                return this.modal
                  .message(
                    `The minimum backend version is ${MINIMUM_CTU_VERSION}.
                      You have version ${version} installed.
                      Please upgrade your 2300 installation.`,
                    'Invalid Backend Version',
                    'Dismiss',
                  )
                  .pipe(map(() => undefined));
              }
              return of(conn);
            }),
          );
        }),
        catchError((err: HttpErrorResponse) => {
          this.log.error('Error opening session', err);
          this.sessionError.next(true);
          const predicate = (backendError: BackendError) => {
            const errorName: string = backendError.errorName;
            const errors: string[] = [
              ConnectionErrorCode.ctuWorkersUnavailable,
              ConnectionErrorCode.unknown,
            ];
            return errors.includes(errorName);
          };
          const execute = (backendError: BackendError) => {
            switch (backendError.errorName) {
              case ConnectionErrorCode.ctuWorkersUnavailable:
                return this.modal
                  .message(
                    `Number of sessions connected to ‘${address}’ is at limit.
                    Please try again later.`,
                    'Unable to Connect to Tool',
                    'Dismiss',
                  )
                  .pipe(mergeMap(_result => empty()));
              // In case of unknown http error when getting address
              default:
                return this.modal
                  .message(
                    `No response from ${address}. Verify that ${address} is online`,
                    'Problem Connecting',
                    'Dismiss',
                  )
                  .pipe(mergeMap(_result => empty()));
            }
          };
          return handleBackendError(this.store, err, { predicate, execute }).pipe(
            endWith(undefined),
          );
        }),
        takeUntil(this.unsubscribe),
      )
      .subscribe(conn => {
        this.processSession(conn ? conn.session : undefined, address);
      });
  }

  /**
   * Handle the session connection result. The session may be undefined if the connection failed.
   *
   * @param session The session information from the server, if the connection was successful
   * @param address The address the session is connected to
   */
  processSession(session: Session | undefined, address: string) {
    if (session) {
      this.session = { ...session, address };
      this.updateQueryParams({ address });
      this.getResourceList();
      this.sendHeartbeat(session.sessionID);
      this.nextWizardStep(WizardStep.Login);
    } else {
      this.resetClientSession();
    }
  }

  /**
   * Obtain the resource list from the server and apply it into a Subject.
   */
  getResourceList() {
    this.getResourceDetails()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(list => this.resourceList.next(list));
  }

  /**
   * Obtain the resource list from the server.
   */
  getResourceDetails(): Observable<MachineResource[]> {
    const arbitrationUrl = `${this.backendUrl.value}/sessionmanager/v3/arbitration`;
    const imageOptionsUrl = `${this.backendUrl.value}/image/v3/options`;
    HttpProgressService.registerBackgroundTaskUrlOnce(imageOptionsUrl);

    return this.http.get<{ arbitration: Resource[] }>(arbitrationUrl).pipe(
      map(({ arbitration: resources }) => filterResources(resources)),
      // The http.get will only ever emit once, so switchMap, concatMap, and mergeMap are
      // interchangeable here.
      switchMap(resources => {
        const reqOptions = resources.map(r => ({
          optionName: 'ModelName',
          imageName: r.pmImage,
        }));
        return this.http
          .post<{ options: ImageOptions[] }>(imageOptionsUrl, {
            options: reqOptions,
          })
          .pipe(
            map(({ options }) => {
              return resources.map(r => {
                const pmOptions = options.find(o => o.imageName === r.pmImage);
                if (pmOptions) {
                  r.modelName = pmOptions.optionValue;
                }
                return r;
              });
            }),
          );
      }),
    );
  }

  /**
   * Process login credentials, as provided by the user.
   *
   * @param loginInfo the login credentials
   */
  login(loginInfo: LoginCredentials) {
    this.loginError.next(false);
    if (this.session) {
      this.http
        .post(`${this.backendUrl.value}/sessionmanager/v3/login`, {
          ...loginInfo,
          sessionID: this.session.sessionID,
        })
        .pipe(
          mapTo(true), // The backend returns an empty response, so on success, map to true.
          catchError((err: HttpErrorResponse) => {
            this.log.error('Error during login', err);
            this.loginError.next(true);
            const predicate = (backendError: BackendError) => {
              // if it's just the server reporting a bad password, no need for a dialog
              const errorName: string = backendError.errorName;
              return errorName === ConnectionErrorCode.userLoginFailed;
            };
            const execute = (_backendError: BackendError) => {
              // if it's just the server reporting a bad password, no need for a dialog
              return of(false);
            };
            return handleBackendError(this.store, err, { predicate, execute });
          }),
          takeUntil(this.unsubscribe),
        )
        .subscribe(success => {
          if (success) {
            this.nextWizardStep(WizardStep.Arbitration);
          }
        });
    } else {
      this.log.error('Error during login', ['Session not found']);
      this.loginError.next(true);
    }
  }

  /**
   * Attempt to obtain a lock on the resource, if it is not already locked.
   *
   * @param resourceName The name of the resource to lock, e.g. "PMx"
   */
  getResourceLock(resourceName: string) {
    if (!resourceName) {
      this.log.error('No resource defined');
      return;
    }

    if (this.session) {
      const session = this.session;
      combineLatest(
        this.latestBackendConfig,
        this.electron.isElectron() ? this.electron.getEnvironment() : of(undefined),
      )
        .pipe(
          withLatestFrom(this.resourceList),
          switchMap(([[backendConfig, desktopEnv], resourceList]) => {
            if (!backendConfig) {
              this.log.error('Could not retrieve backend machine configuration.');
              return of(false);
            }

            const resourceLockName: string = getResourceLockName(resourceName); // PMx --> PMxRecipe
            const resource = resourceList.find(r => r.machineResourceName === resourceLockName);
            if (!resource) {
              // resource does not exist in list
              this.log.error(`Resource lock name "${resourceLockName}" not found`);
              return of(false);
            }

            const isEmbedded: boolean = desktopEnv ? desktopEnv.uiMode === UiMode.Embedded : false;
            if (!resource.locked || !backendConfig.arbitrationEnabled || isEmbedded) {
              // The resource is not locked, or we don't care about a previous lock
              return this.prepareResource(resourceName, session);
            }

            if (resource.lockInformation === session.sessionName) {
              // resource already locked by this session; update client state and continue
              return of(true);
            }

            // If we got here, the resource is locked by another session; prompt user to override
            return this.modal
              .confirm(
                'This resource is locked by another session. Override?',
                'Arbitration Override',
              )
              .pipe(
                // if user confirms, go through the normal lock process
                switchMap(override =>
                  override ? this.prepareResource(resourceName, session) : of(false),
                ),
              );
          }),
          takeUntil(this.unsubscribe),
        )
        .subscribe(success => {
          if (success) {
            this.resourceName.next(resourceName);
            this.updateQueryParams({ resource: resourceName });
            this.nextWizardStep(WizardStep.Complete);
          } else {
            this.resetClientSession();
          }
        });
    }
  }

  /**
   * Set up the backend app by locking the resource, focusing the process module, and changing to
   * the recipe editor on the backend.
   *
   * By configuration, the resource locking part of the sequence may be skipped.
   */
  prepareResource(resourceName: string, session: Session): Observable<boolean> {
    const focusBody = {
      sessionID: session.sessionID,
      resourceName,
    };
    return this.latestBackendConfig.pipe(
      truthy(), // Do nothing if we couldn't get the backend config object.
      switchMap((backendConfig: BackendConfigOptions) => {
        // 1) lock the resource (if necessary)
        if (!backendConfig.arbitrationEnabled) {
          // needs to have something in the observable to trigger the next step
          return of(undefined);
        } else {
          const lockResourceBody = {
            sessionID: session.sessionID,
            resourceNames: [`${resourceName}Recipe`],
          };
          return this.http.post(
            `${this.backendUrl.value}/sessionmanager/v3/lockresource`,
            lockResourceBody,
          );
        }
      }),
      // 2) focus the process module
      // The http.posts will each only ever emit once, so switchMap, concatMap, and mergeMap are
      // interchangeable here.
      switchMap(_ => this.http.post(`${this.ctuUrl.value}/ui/v3/focus`, focusBody)),
      this.setupBackendForFirstTimeUse(session),
      mapTo(true), // The backend returns an empty response, so on success, map to true.
      timeout(arbitrationTimeout),
      catchError((err: HttpErrorResponse) => {
        this.log.error('Error during resource lock', err);
        return handleBackendError(this.store, err).pipe(endWith(false));
      }),
    );
  }

  setupBackendForFirstTimeUse(
    session: Session,
  ): UnaryFunction<Observable<unknown>, Observable<{} | unknown>> {
    if (this.resourceName.value === '') {
      const pagesBody = {
        sessionID: session.sessionID,
        superPage: 'RecipeEditor',
        subPage: 'Recipe',
      };
      // change to the recipe editor page
      return switchMap(_ => this.http.post<{}>(`${this.ctuUrl.value}/ui/v3/pages`, pagesBody));
    } else {
      return pipe();
    }
  }

  /**
   * Send a recurring heartbeat to the server. If the response is successful, update the list of
   * resources (they might have been locked or gone online or offline). Handle user inactivity.
   *
   * @param sessionID The id of the current session
   */
  sendHeartbeat(sessionID: string) {
    const heartbeatTime = 20000; // 20 seconds
    const heartBeatUrl = `${this.backendUrl.value}/sessionmanager/v3/resetcountdown`;
    HttpProgressService.registerBackgroundTaskUrl(heartBeatUrl);

    this.stopHeartbeat();
    this.heartbeat = interval(heartbeatTime)
      .pipe(
        // If we use switchMap here and the network takes longer than heartbeatTime to complete
        // HTTP requests, then no request will complete because each will be cancelled before
        // finishing. Thus we use mergeMap here to allow pending requests to play out.
        mergeMap(_ => this.http.post<HeartbeatResponse>(heartBeatUrl, { sessionID })),
        takeUntil(this.unsubscribe),
      )
      .subscribe(
        response => {
          this.updateResourceList(response.arbitration);
          this.evaluateInactivity(response.remainingInactivityTime, sessionID);
        },
        err => {
          this.log.error('Error on heartbeat response; session disconnected', err);
          this.resetClientSession();
        },
      );
  }

  /**
   * Process the resources obtained from the heartbeat, and update the Subject.
   *
   * @param arbitration the current resource information
   */
  updateResourceList(arbitration: Resource[]) {
    const newResources = filterResources(arbitration);
    const resourceList = cloneDeep(this.resourceList.value).map(res => ({
      ...res,
      ...newResources.find(n => n.machineResourceName === res.machineResourceName),
    }));
    this.resourceList.next(resourceList);
  }

  /**
   * Stop sending the heartbeat.
   */
  stopHeartbeat() {
    if (this.heartbeat) {
      this.heartbeat.unsubscribe();
    }
  }

  /**
   * Clear all session information and reset the wizard and the url.
   */
  resetClientSession(mode = ResetConnectionMode.Normal) {
    this.stopHeartbeat();
    this.session = undefined;
    this.resourceName.next('');
    if (mode === ResetConnectionMode.FatalError) {
      this.router.navigate(['/error']);
    } else {
      this.router.navigate(['/']);
    }
    this.nextWizardStep(WizardStep.Session);
    this.store.dispatch(resetClientSession());
  }

  /**
   * Handles the heartbeat response. The response indicates how many seconds are left before
   * timeout, and this function will warn the user if timeout would occur within 2 minutes.
   *
   * @param remainingInactivityTime Remaining time in seconds
   * @param sessionID The current user session
   */
  evaluateInactivity(remainingInactivityTime: number, sessionID: string) {
    // we warn the user if there is less than 2 minutes less, but we don't show redundant dialogs
    if (remainingInactivityTime < 120 && !this.heartbeatMessageOpen) {
      this.heartbeatMessageOpen = true;
      const msg =
        'PDE has detected that you have been inactive. ' +
        "Click 'OK' to continue with this editing session.";
      this.modal
        .message(msg, 'Inactivity Timeout Warning')
        .pipe(
          take(1),
          tap(_ => (this.heartbeatMessageOpen = false)), // flip the flag, the modal has been closed
          // if the user responds to the dialog, we reset the timeout on the server (but not on Esc)
          filter(result => !!result),
          // Only one event goes thru this pipeline, so switchMap, mergeMap, and concatMap are
          // equivalent.
          switchMap(_ => this.resetInactivity(sessionID)),
          takeUntil(this.unsubscribe),
        )
        .subscribe(
          _ => {},
          err => {
            this.log.error('Error on resetinactivity response; session disconnected', err);
            this.resetClientSession();
          },
        );
    }
  }

  resetInactivity(sessionID: string = this.session ? this.session.sessionID : ''): Observable<any> {
    if (sessionID) {
      return this.http.post(`${this.backendUrl.value}/sessionmanager/v3/resetinactivity`, {
        sessionID,
      });
    } else {
      // there is no session in devMode, so we don't need to send anything
      return of(undefined);
    }
  }

  /**
   * Handle closing the session.
   */
  closeSession() {
    if (this.session) {
      this.http
        .post(`${this.backendUrl.value}/sessionmanager/v3/closesession`, {
          sessionID: this.session.sessionID,
        })
        .pipe(
          catchError(err => {
            // if the session is gone when we try to close it, log and move on
            const errorName = extractErrorName(err);
            if (errorName === ConnectionErrorCode.sessionIDNotFound) {
              this.log.info('closesession: Session not found', err);
            } else {
              this.log.error('Unknown error occurred when closing a session', err);
            }
            return handleBackendError(this.store, err);
          }),
          takeUntil(this.unsubscribe),
        )
        .subscribe();
    }
    this.resetClientSession();
  }

  updateQueryParams(newParams: {}) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...this.activatedRoute.snapshot.queryParams,
        ...newParams,
      },
    });
  }

  /**
   * Get the machine configuration object from the backend. Emits undefined if the HTTP request does
   * not succeed.
   * @param backendUrl The url for the 2300 backend.
   */
  private getMachineConfig(backendUrl: string): Observable<MachineConfiguration | InvalidState> {
    const url = `${backendUrl}/machine/v1/configuration`;

    HttpProgressService.registerBackgroundTaskUrlOnce(url);
    return this.http
      .get<ConfigurationResponse>(url, {
        params: { configurationType: 'machine' },
      })
      .pipe(
        map(response => response.machineConfiguration),
        startWith('PENDING' as const),
        catchError((err: HttpErrorResponse) => {
          this.log.error('Error while getting machine configuration ', err);
          return handleBackendError(this.store, err).pipe(endWith(undefined));
        }),
      );
  }
}
