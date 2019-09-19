import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription, interval, of } from 'rxjs';
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
  withLatestFrom
} from 'rxjs/operators';
import { Session, MachineResource, Resource, LoginCredentials } from '../types/types';


//import { extractErrorName, handleBackendError } from '../common/util/connection-utils';
//import { LogService, Logger } from '../log/log.service';
//import { BackendError } from '../pde/pde-types';
//import { PdeState, getConfig, ResetClientSession } from '../pde/state/pde-state';
//import { useContextBody } from './constants';
//import { filterResources, getProcessModuleName } from './resource-utils';
//import { HeartbeatResponse, LoginCredentials, MachineResource, Resource, Session } from './types';

export enum WizardStep { Session, Login, Arbitration, Complete }

export enum ConnectionErrorCode {
  sessionIDNotFound = 'SessionIDNotFound',
  ctuWorkersUnavailable = 'CTUWorkersUnavailable',
  userLoginFailed = 'UserLoginFailed',
}

const arbitrationTimeout = 60 * 1000;
const backendPort = '18072';
const openSessionBody = {
  clientname: 'PDE Client',
  worker: {
    type: 'ctu',
    window: 'hide',
    launcher: 'hide'
  },
};

interface ImageOptions {
  imageName: string;
  optionName: string;
  optionValue: string;
}

/**
 * Service to manage the session, login, arbitration, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
 // private readonly log: Logger;
  private _wizardStep = new BehaviorSubject<WizardStep>(WizardStep.Session);
  wizardStep: Observable<WizardStep> = this._wizardStep.asObservable();
  session: Session | undefined;
  resourceList = new BehaviorSubject<MachineResource[]>([]);
  resourceName = new BehaviorSubject<string>('');
  sessionError = new BehaviorSubject<boolean>(false);
  loginError = new BehaviorSubject<boolean>(false);
  heartbeat?: Subscription;
  private heartbeatMessageOpen: boolean = false;
  backendUrl?: string;
  ctuUrl?: string;

  constructor(
    private http: HttpClient,
   // logService: LogService,
  //  private store: Store<PdeState>,

    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    //this.log = logService.createLogger('ConnectionService');
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
    // If the address is given, attempt to connect automatically. Otherwise, start the wizard.
    if (address) {
      this.openSession(address);
    } else {
      this.nextWizardStep(WizardStep.Session);
    }

    // If the resource is given, attempt to lock it automatically after login.
    if (resource) {
      this.wizardStep.pipe(
        takeUntil(notifier),
        filter(step => step === WizardStep.Arbitration),
        take(1),
      ).subscribe(_ => this.getResourceLock(resource));
    }

    return this.wizardStep.pipe(
      takeUntil(notifier),
      map(step => step === WizardStep.Complete),
      distinctUntilChanged(),
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
    this.backendUrl = `${fullAddress}:${backendPort}`;

    this.http.post<Session>(
      `${this.backendUrl}/sessionmanager/v3/opensession`,
      openSessionBody
    ).pipe(
      timeout(arbitrationTimeout),
      tap(session => this.ctuUrl = `${fullAddress}:${session.workerPort}`),
      // catchError((err: HttpErrorResponse) => {
      //   this.log.error('Error opening session', err);
      //   this.sessionError.next(true);
      //   const predicate = (backendError: BackendError) => {
      //     const errorName: string = backendError.errorName;
      //     return errorName === ConnectionErrorCode.ctuWorkersUnavailable;
      //   };
      //   const execute = (_backendError: BackendError) => {
      //     return this.modal.message(
      //       `Number of sessions connected to ‘${address}’ is at limit. Please try again later.`,
      //       'Unable to Connect to Tool',
      //       'Dismiss'
      //     );
      //   };
      //   return handleBackendError(this.store, err, { predicate, execute }).pipe(
      //     mapTo(undefined)
      //   );
      // }),
    ).subscribe(session => {
      this.processSession(session, address);
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
     // this.getResourceList();
     // this.sendHeartbeat(session.sessionID);
      this.nextWizardStep(WizardStep.Login);
    } else {
    //  this.resetClientSession();
    }
  }




  /**
   * Process login credentials, as provided by the user.
   *
   * @param loginInfo the login credentials
   */
  login(loginInfo: LoginCredentials) {
    this.loginError.next(false);
    if (this.session) {
      this.http.post(
        `${this.backendUrl}/sessionmanager/v3/login`,
        { ...loginInfo, sessionID: this.session.sessionID }
      ).pipe(
        mapTo(true), // The backend returns an empty response, so on success, map to true.
        // catchError((err: HttpErrorResponse) => {
        //  // this.log.error('Error during login', err);
        //   this.loginError.next(true);
        //   const predicate = (backendError: BackendError) => {
        //     // if it's just the server reporting a bad password, no need for a dialog
        //     const errorName: string = backendError.errorName;
        //     return errorName === ConnectionErrorCode.userLoginFailed;
        //   };
        //   const execute = (_backendError: BackendError) => {
        //     // if it's just the server reporting a bad password, no need for a dialog
        //     return of(false);
        //   };
        //   return handleBackendError(this.store, err, { predicate, execute });
        // }),
      ).subscribe(success => {
        if (success) {
          this.nextWizardStep(WizardStep.Arbitration);
        }
      });
    } else {
     // this.log.error('Error during login', ['Session not found']);
      this.loginError.next(true);
    }
  }




  private updateQueryParams(newParams: {}) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...this.activatedRoute.snapshot.queryParams,
        ...newParams,
      }
    });
  }
}
