import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of, pipe, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { MachineResource, WizardStep, Session, LoginCredentials, ConfigurationResponse, HeartbeatResponse } from '../types/types';
import { isProcessModule, filterResources, extractBackendConfig } from '../utils/resource-utils';
import { ConnectionService } from './connection.service';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { SpyObject, logSpy } from '@lamresearch/utility';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { ModalService, ConnectionErrorCode, ICTUVersionResponse } from '@lamresearch/lam-common-lazy';
// tslint:disable-next-line:nx-enforce-module-boundaries
import {  LogEntries,ROOT_REDUCERS } from '@lamresearch/lam-common-eager';
import { rawResources, filteredResources } from '../utils/resource-utils.spec';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as fromSession from '../store/reducers';
import { SessionActions } from '../store/actions';
function conjurePdeResource(
  machineResourceName: string,
  displayName: string,
  locked: boolean,
  lockInformation: string,
  offline = false,
): MachineResource {
  return {
    machineResourceName,
    displayName,
    locked,
    lockInformation,
    offline,
  } as MachineResource;
}

describe('isProcessModule', () => {
  it('should be true for "PMx" resources', () => {
    expect(isProcessModule('PM03')).toBe(true);
  });

  it('should be false for other resources', () => {
    expect(isProcessModule()).toBe(false);
    expect(isProcessModule('someOtherResource')).toBe(false);
  });
});

describe('ConnectionService', () => {
  let connSvc: ConnectionService;
  let httpMock: HttpTestingController;
  //todo:pde->any
 // let store: Store<any>;
  //jasmine.spyobject => any
  let modal: any;
  let router: any;
  let activatedRoute: ActivatedRoute;
  let store: MockStore<fromSession.State>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: new SpyObject(ActivatedRoute) },
        { provide: ModalService, useValue: new SpyObject(ModalService) },
        { provide: Router, useValue: new SpyObject(Router) },
        ConnectionService,LogEntries,provideMockStore()
      ],
      imports: [
        HttpClientTestingModule,
        // StoreModule.forRoot(ROOT_REDUCERS, {
        //   runtimeChecks: {
        //     strictStateImmutability: true,
        //     strictActionImmutability: true,
        //     strictStateSerializability: false,
        //     strictActionSerializability: true,
        //   },
        // }),
      //  StoreModule.forFeature(fromSession.sessionFeatureKey, fromSession.reducers),
      ],
    });

    connSvc = TestBed.get(ConnectionService);
    httpMock = TestBed.get(HttpTestingController);
    store = TestBed.get(Store);
    modal = TestBed.get(ModalService);
    router = TestBed.get(Router);
    activatedRoute = TestBed.get(ActivatedRoute);

    activatedRoute.snapshot = { ...activatedRoute.snapshot, queryParams: {} };
   // spyOn(store, 'dispatch').and.callThrough();
    spyOn(connSvc.sessionError, 'next').and.callThrough();
    spyOn(connSvc.loginError, 'next').and.callThrough();

    connSvc.ctuUrl.next('ctuUrl');
    connSvc.backendUrl.next('backendUrl');
  });

  it('should be created', () => {
    expect(connSvc).toBeTruthy();
  });

  describe('openSession', () => {
    const address = 'mockAddress';
    const backendUrl = `http://${address}:18072`;
    const workerPort = 9876;

    beforeEach(() => {
      spyOn(connSvc, 'processSession').and.callFake(() => { });
      spyOn(store, 'dispatch');
    });

    it('should open a session', async () => {
      const sessionResponse = { workerPort } as Session;

      let url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      connSvc.openSession(address);

      expect(connSvc.backendUrl.value).not.toEqual(backendUrl);
      const sessionReq = httpMock.expectOne(`${backendUrl}/sessionmanager/v3/opensession`);
      expect(sessionReq.request.method).toEqual('POST');

      sessionReq.flush(sessionResponse);
      expect(connSvc.backendUrl.value).toEqual(backendUrl);

      url = `${backendUrl}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      url = `${backendUrl}/image/v1/versions`;
      const versionReq = httpMock.expectOne(request => request.url === url);
      versionReq.flush({
        apiServices: {
          lamWaferFlowService: '0.0.0',
        },
      } as ICTUVersionResponse);

      httpMock.verify();

      expect(logSpy.error).not.toHaveBeenCalled();
      expect(await connSvc.sessionError.pipe(take(1)).toPromise()).toBe(false);
      expect(connSvc.processSession).toHaveBeenCalledWith(sessionResponse, 'mockAddress');
      const action = SessionActions.sessionCreate({session: {"workerPort": 9876}});
      expect(store.dispatch).toHaveBeenCalledWith(action);
     // expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should handle errors when opening a session (starting with full address)', async () => {
      modal.message.and.returnValue(of(true));

      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      connSvc.openSession('http://mockAddress');

      const req = httpMock.expectOne(`${backendUrl}/sessionmanager/v3/opensession`);

      req.error(new ErrorEvent(''));

      httpMock.verify();

     // expect(logSpy.error).toHaveBeenCalled();
      expect(await connSvc.sessionError.pipe(take(1)).toPromise()).toBe(true);
      expect(connSvc.processSession).toHaveBeenCalledWith(undefined, 'http://mockAddress');
      expect(modal.message).toHaveBeenCalled();
     // expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should handle a ctu error', async () => {
      modal.message.and.returnValue(of(true));

      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      connSvc.openSession('mockAddress');

      const req = httpMock.expectOne(`${backendUrl}/sessionmanager/v3/opensession`);

      const error = {
        errors: [
          {
            errorName: ConnectionErrorCode.ctuWorkersUnavailable,
          },
        ],
      };
      req.error(error as any);



      httpMock.verify();

     // expect(logSpy.error).toHaveBeenCalled();
      expect(connSvc.ctuUrl.value).toBe('ctuUrl');
      expect(await connSvc.sessionError.pipe(take(1)).toPromise()).toBe(true);
      expect(connSvc.processSession).toHaveBeenCalledWith(undefined, 'mockAddress');
      expect(modal.message).toHaveBeenCalled();
    //  expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('processSession', () => {
    beforeEach(() => {
      spyOn(connSvc, 'getResourceList');
      spyOn(connSvc, 'sendHeartbeat');
      spyOn(connSvc, 'nextWizardStep');
    });

    it('should handle a session', () => {
      const session = { sessionID: '124' } as Session;

      connSvc.processSession(session, 'add');

      expect(connSvc.session).toEqual({ sessionID: '124', address: 'add' } as Session);
      expect(connSvc.getResourceList).toHaveBeenCalled();
      expect(connSvc.sendHeartbeat).toHaveBeenCalledWith('124');
      expect(connSvc.nextWizardStep).toHaveBeenCalledWith(WizardStep.Login);
    });

    it('should handle no session', () => {
      connSvc.processSession(undefined, 'add');

      expect(connSvc.session).toBeUndefined();
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      expect(connSvc.getResourceList).not.toHaveBeenCalled();
      expect(connSvc.sendHeartbeat).not.toHaveBeenCalled();
      expect(connSvc.nextWizardStep).toHaveBeenCalledWith(WizardStep.Session);
    });
  });

  describe('getResourceDetails', () => {
    const arbitrationResponse = { arbitration: rawResources };
    const result = [
      { ...filteredResources[0] }

    ];

    it('should process the resource details', done => {
      connSvc.getResourceDetails().subscribe(val => {
        expect(val).toEqual(result);
        done();
      });

      const arbitrationReq = httpMock.expectOne(
        `${connSvc.backendUrl.value}/sessionmanager/v3/arbitration`,
      );
      expect(arbitrationReq.request.method).toEqual('GET');
      arbitrationReq.flush(arbitrationResponse);



      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();
    });
  });

  describe('login', () => {
    let loginInfo: LoginCredentials;
    let session: Session;

    beforeEach(() => {
      loginInfo = { username: 'u', password: 'p' };
      session = { sessionID: 's' } as Session;
      spyOn(connSvc, 'nextWizardStep');
      spyOn(connSvc, 'getResourceLock');
    });

    it('should process a login w/ a session', async () => {
      const reqBody = { username: 'u', password: 'p', sessionID: 's' };
      connSvc.session = session;
      connSvc.login(loginInfo);
      const req = httpMock.expectOne(`${connSvc.backendUrl.value}/sessionmanager/v3/login`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(reqBody);
      req.flush({});
      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();

     // expect(logSpy.error).not.toHaveBeenCalled();
      expect(await connSvc.loginError.pipe(take(1)).toPromise()).toBe(false);
      expect(connSvc.getResourceLock).toHaveBeenCalled();
     // expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not process a login w/o a session', async () => {
      connSvc.login(loginInfo);

      httpMock.expectNone(`${connSvc.backendUrl.value}/sessionmanager/v3/login`);

      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();

     // expect(logSpy.error).toHaveBeenCalled();
      expect(await connSvc.loginError.pipe(take(1)).toPromise()).toBe(true);
     // expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      connSvc.session = session;

      connSvc.login(loginInfo);

      const req = httpMock.expectOne(`${connSvc.backendUrl.value}/sessionmanager/v3/login`);

      req.error(new ErrorEvent(''));

      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();

    //  expect(logSpy.error).toHaveBeenCalled();
      expect(await connSvc.loginError.pipe(take(1)).toPromise()).toBe(true);
      // assertProcessError(store.dispatch as jasmine.Spy);
    });

    it('should handle the error we get with a bad password', async () => {
      connSvc.session = session;

      connSvc.login(loginInfo);

      const req = httpMock.expectOne(`${connSvc.backendUrl.value}/sessionmanager/v3/login`);

      const error = {
        errors: [
          {
            errorName: ConnectionErrorCode.userLoginFailed,
          },
        ],
      };
      req.error(error as any);

      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();

     // expect(logSpy.error).toHaveBeenCalled();
      expect(await connSvc.loginError.pipe(take(1)).toPromise()).toBe(true);
      expect(connSvc.nextWizardStep).not.toHaveBeenCalled();
     // expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('getResourceLock', () => {
    let resourceList: MachineResource[];
    let resourceName: string;

    let session: Session;



    beforeEach(() => {
      resourceName = 'PM123';
      session = { sessionID: 's' } as Session;
      resourceList = [
        conjurePdeResource('otherRn', 'r1', true, 'li1'),
        conjurePdeResource('PM123', 'PM123', true, 'li2'),
      ];
     // store.dispatch(receiveConfig({} as PdeConfig));
      spyOn(connSvc, 'nextWizardStep');
      spyOn(connSvc, 'prepareResource');
      activatedRoute.snapshot = new ActivatedRouteSnapshot();
      activatedRoute.snapshot.queryParams = {
        qp: 'value',
      };
      connSvc.backendConfigOptions.next({
        arbitrationEnabled: true,
        endpointEditorEnabled: true,
        hydraEditorEnabled: true,
      });
    });

    it('should handle no resource lock name', async () => {
      connSvc.getResourceLock('');

     // expect(logSpy.error).toHaveBeenCalled();
      expect(connSvc.prepareResource).not.toHaveBeenCalled();
      expect(modal.confirm).not.toHaveBeenCalled();
      expect(connSvc.resourceName.value).toBe('');
     // expect(connSvc.nextWizardStep).not.toHaveBeenCalled();
    //  expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle mismatched resource lock name', async () => {
      connSvc.session = <any>{}; // Pass the session check

      connSvc.getResourceLock('mismatch');

      //expect(logSpy.error).toHaveBeenCalled();
      expect(connSvc.prepareResource).not.toHaveBeenCalled();
      expect(modal.confirm).not.toHaveBeenCalled();
      expect(connSvc.resourceName.value).toBe('');
     // expect(connSvc.nextWizardStep).toHaveBeenCalledWith(WizardStep.Session);
      //expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle the default state (no session)', async () => {
      connSvc.getResourceLock(resourceName);

     // expect(logSpy.error).not.toHaveBeenCalled();
      expect(connSvc.prepareResource).not.toHaveBeenCalled();
      expect(modal.confirm).not.toHaveBeenCalled();
      expect(connSvc.resourceName.value).toBe('');
     // expect(connSvc.nextWizardStep).not.toHaveBeenCalled();
     // expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle the default state (no resources)', async () => {
      connSvc.session = { sessionName: 'sn' } as Session;

      connSvc.getResourceLock(resourceName);

     // expect(logSpy.error).toHaveBeenCalled();
      expect(connSvc.prepareResource).not.toHaveBeenCalled();
      expect(modal.confirm).not.toHaveBeenCalled();
      expect(connSvc.resourceName.value).toBe('');
     //// expect(connSvc.nextWizardStep).toHaveBeenCalledWith(WizardStep.Session);
     // expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle no matching resources', async () => {
      connSvc.session = { sessionName: 'sn' } as Session;
      resourceList[1].machineResourceName = 'wrong';
      connSvc.resourceList.next(resourceList);

      connSvc.getResourceLock(resourceName);

     // expect(logSpy.error).toHaveBeenCalled();
      expect(connSvc.prepareResource).not.toHaveBeenCalled();
      expect(modal.confirm).not.toHaveBeenCalled();
      expect(connSvc.resourceName.value).toBe('');
     // expect(connSvc.nextWizardStep).toHaveBeenCalledWith(WizardStep.Session);
     // expect(router.navigate).toHaveBeenCalledTimes(1);
     // expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle not locked (and locking failing)', async () => {
      connSvc.session = {} as Session;
      resourceList[1].locked = false;
      connSvc.resourceList.next(resourceList);
      (connSvc.prepareResource as jasmine.Spy).and.returnValue(of(false));

      connSvc.getResourceLock(resourceName);

      // expect(logSpy.error).not.toHaveBeenCalled();
      expect(connSvc.prepareResource).toHaveBeenCalledWith('PM123', {});
      expect(modal.confirm).not.toHaveBeenCalled();
      expect(connSvc.resourceName.value).toBe('');
      expect(connSvc.nextWizardStep).toHaveBeenCalledWith(WizardStep.Session);
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle skipping arbitration', () => {
      connSvc.backendConfigOptions.next({
        arbitrationEnabled: false,
        endpointEditorEnabled: true,
        hydraEditorEnabled: true,
      });
      connSvc.session = {} as Session;
      resourceList[1].locked = false;
      connSvc.resourceList.next(resourceList);
     // store.dispatch(receiveConfig({} as PdeConfig));
     // (store.dispatch as jasmine.Spy).calls.reset();
      (connSvc.prepareResource as jasmine.Spy).and.returnValue(of(false));

      connSvc.getResourceLock(resourceName);

     // expect(logSpy.error).not.toHaveBeenCalled();

      expect(connSvc.prepareResource).toHaveBeenCalledWith('PM123', {});
      expect(modal.confirm).not.toHaveBeenCalled();
      expect(connSvc.resourceName.value).toBe('');
      expect(connSvc.nextWizardStep).toHaveBeenCalledWith(WizardStep.Session);
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle not locked (and locking succeeding)', async () => {
      connSvc.session = {} as Session;
      resourceList[1].locked = false;
      connSvc.resourceList.next(resourceList);
     // (store.dispatch as jasmine.Spy).calls.reset();
      (connSvc.prepareResource as jasmine.Spy).and.returnValue(of(false));

      connSvc.getResourceLock(resourceName);

     // expect(logSpy.error).not.toHaveBeenCalled();

      expect(connSvc.prepareResource).toHaveBeenCalledWith('PM123', {});
      expect(modal.confirm).not.toHaveBeenCalled();
      expect(connSvc.resourceName.value).toBe('');
      expect(connSvc.nextWizardStep).toHaveBeenCalledWith(WizardStep.Session);
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle same session locking', async () => {
      connSvc.session = { sessionName: resourceList[1].lockInformation } as Session;
      connSvc.resourceList.next(resourceList);
     // (store.dispatch as jasmine.Spy).calls.reset();

      connSvc.getResourceLock(resourceName);

     // expect(logSpy.error).not.toHaveBeenCalled();
      expect(connSvc.prepareResource).not.toHaveBeenCalled();
      expect(modal.confirm).not.toHaveBeenCalled();
     // expect(connSvc.resourceName.value).toBe('PM123');
      // expect(connSvc.nextWizardStep).toHaveBeenCalledWith(WizardStep.Complete);
      // expect(router.navigate).toHaveBeenCalledTimes(1);
      // expect(router.navigate).toHaveBeenCalledWith([], {
      //   relativeTo: activatedRoute,
      //   queryParams: {
      //     qp: 'value',
      //     resource: 'PM123',
      //   },
      // });
    });

    it('should handle declining to override', async () => {
      connSvc.session = {} as Session;
      connSvc.resourceList.next(resourceList);
     // (store.dispatch as jasmine.Spy).calls.reset();
      modal.confirm.and.returnValue(of(false));

      connSvc.getResourceLock(resourceName);

    //  expect(logSpy.error).not.toHaveBeenCalled();
      expect(connSvc.prepareResource).not.toHaveBeenCalled();
      expect(modal.confirm).toHaveBeenCalled();
      expect(connSvc.resourceName.value).toBe('');
      expect(connSvc.nextWizardStep).toHaveBeenCalledWith(WizardStep.Session);
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle successful locking with override', async () => {
      connSvc.session = {} as Session;
      connSvc.resourceList.next(resourceList);
     // (store.dispatch as jasmine.Spy).calls.reset();
      modal.confirm.and.returnValue(of(true));
      (connSvc.prepareResource as jasmine.Spy).and.returnValue(of(true));

      connSvc.getResourceLock(resourceName);

      //expect(logSpy.error).not.toHaveBeenCalled();

      expect(connSvc.prepareResource).toHaveBeenCalledWith('PM123', {});
      expect(modal.confirm).toHaveBeenCalled();
     // expect(connSvc.resourceName.value).toBe('PM123');
     // expect(connSvc.nextWizardStep).toHaveBeenCalledWith(WizardStep.Complete);
      expect(router.navigate).toHaveBeenCalledTimes(1);
      // expect(router.navigate).toHaveBeenCalledWith([], {
      //   relativeTo: activatedRoute,
      //   queryParams: {
      //     qp: 'value',
      //     resource: 'PM123',
      //   },
      // });
    });
  });

  describe('prepareResource', () => {
    let resourceName: string;
    let session: Session;

    beforeEach(() => {
      resourceName = 'PM123';
      session = { sessionID: 's' } as Session;
    });

    it('should skip lockResource w/ a session', done => {
      // set config to skip arbitration
      connSvc.backendConfigOptions.next({
        arbitrationEnabled: false,
        endpointEditorEnabled: false,
        hydraEditorEnabled: false,
      });

      const focusBody = {
        sessionID: 's',
        resourceName: 'PM123',
      };

      connSvc.prepareResource(resourceName, session).subscribe(result => {
        expect(result).toBe(true);
        expect(logSpy.error).not.toHaveBeenCalled();

        done();
      });

      httpMock.expectNone(`${connSvc.backendUrl.value}/sessionmanager/v3/lockresource`);



      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();
     // expect(store.dispatch).not.toHaveBeenCalled();
    });

    describe('with machine config', () => {
      beforeEach(() => {
        const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
        const configReq = httpMock.expectOne(request => request.url === url);
        configReq.flush(<ConfigurationResponse>{
          machineConfiguration: {
            imageOptions: {
              PM123Image: {
                OESType: 'dontcare',
                HydraControllerInstalled: true,
                HydraControllerMode: 'Enable',
              },
              HostImage: {
                RecipeEditorArbitration: 'Enable',
              },
            },
          },
        });
      });

      it('should process a prepareResource w/ a session', done => {
        const lockResourceBody = {
          sessionID: 's',
          resourceNames: ['PM123'],
        };
        const focusBody = {
          sessionID: 's',
          resourceName: 'PM123',
        };

        connSvc.prepareResource(resourceName, session).subscribe(result => {
          expect(result).toBe(true);
          expect(logSpy.error).not.toHaveBeenCalled();

          done();
        });

        const baseUrl = connSvc.backendUrl.value;
        const lockReq = httpMock.expectOne(`${baseUrl}/sessionmanager/v3/lockresource`);
        expect(lockReq.request.method).toEqual('POST');
        expect(lockReq.request.body).toEqual(lockResourceBody);
        lockReq.flush({});



        httpMock.verify();
      //  expect(store.dispatch).not.toHaveBeenCalled();
      });

      it('should handle errors', done => {
        connSvc.prepareResource(resourceName, session).subscribe(
          result => {
            expect(result).toBe(false);

            done();
          },
          _err => fail('error was not handled'),
        );

        const backendUrl = connSvc.backendUrl.value;
        const req = httpMock.expectOne(`${backendUrl}/sessionmanager/v3/lockresource`);

        req.error(new ErrorEvent(''));

        httpMock.verify();

       // assertProcessError(store.dispatch as jasmine.Spy);
      });
    });
  });

  describe('sendHeartbeat', () => {
    beforeEach(() => {
      spyOn(connSvc, 'stopHeartbeat');
      spyOn(connSvc, 'evaluateInactivity');
      spyOn(connSvc, 'resetClientSession');
      spyOn(connSvc, 'updateResourceList');
    });

    afterEach(() => {
      expect(connSvc.stopHeartbeat).toHaveBeenCalled();
    });

    it('should handle the happy case', fakeAsync(() => {
      connSvc.sendHeartbeat('foo');
      const sub = connSvc.heartbeat;
      tick(21000);

      const baseUrl = connSvc.backendUrl.value;
      const req = httpMock.expectOne(`${baseUrl}/sessionmanager/v3/resetcountdown`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ sessionID: 'foo' });

      const response = { remainingInactivityTime: 10, arbitration: [] } as HeartbeatResponse;
      req.flush(response);

      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();
      expect(connSvc.evaluateInactivity).toHaveBeenCalled();
      expect(connSvc.updateResourceList).toHaveBeenCalledWith([]);
      expect(connSvc.resetClientSession).not.toHaveBeenCalled();
     // expect(logSpy.error).not.toHaveBeenCalled();

      if (sub) {
        sub.unsubscribe();
      }
    }));

    it('should handle an error', fakeAsync(() => {
      connSvc.sendHeartbeat('foo');
      const sub = connSvc.heartbeat;
      tick(21000);

      const baseUrl = connSvc.backendUrl.value;
      const req = httpMock.expectOne(`${baseUrl}/sessionmanager/v3/resetcountdown`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ sessionID: 'foo' });

      req.error(new ErrorEvent(''));

      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();
      expect(connSvc.evaluateInactivity).not.toHaveBeenCalled();
      expect(connSvc.updateResourceList).not.toHaveBeenCalled();
      expect(connSvc.resetClientSession).toHaveBeenCalled();
     // expect(logSpy.error).toHaveBeenCalled();

      if (sub) {
        sub.unsubscribe();
      }
    }));
  });



  describe('resetClientSession', () => {
    beforeEach(() => {
      activatedRoute.snapshot = new ActivatedRouteSnapshot();
      activatedRoute.snapshot.queryParams = {
        qp: 'value',
      };
      spyOn(connSvc, 'stopHeartbeat');
      spyOn(connSvc, 'nextWizardStep');
    });

    it('should reset everything', () => {
      connSvc.session = {} as Session;

      connSvc.resetClientSession();

      expect(connSvc.stopHeartbeat).toHaveBeenCalled();
      expect(connSvc.session).toBeUndefined();
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      expect(connSvc.nextWizardStep).toHaveBeenCalledWith(WizardStep.Session);
    });
  });

  describe('evaluateInactivity', () => {
    it('should handle not needing message yet', () => {
      connSvc.evaluateInactivity(120, 'foo');

      expect(modal.message).not.toHaveBeenCalled();

      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();
      expect(logSpy.error).not.toHaveBeenCalled();
    });

    it('should handle opening the modal and the user clicking', () => {
      modal.message.and.returnValue(of(true));

      connSvc.evaluateInactivity(119, 'foo');

      const baseUrl = connSvc.backendUrl.value;
      const req = httpMock.expectOne(`${baseUrl}/sessionmanager/v3/resetinactivity`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ sessionID: 'foo' });

      expect(modal.message).toHaveBeenCalled();
      req.flush({});

      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();
      expect(logSpy.error).not.toHaveBeenCalled();
    });

    it('should handle opening the modal and the user closing it w/ esc', () => {
      modal.message.and.returnValue(of(false));

      connSvc.evaluateInactivity(119, 'foo');

      expect(modal.message).toHaveBeenCalled();
      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();
      expect(logSpy.error).not.toHaveBeenCalled();
    });

    it('should handle a server error', () => {
      modal.message.and.returnValue(of(true));

      connSvc.evaluateInactivity(119, 'foo');

      const baseUrl = connSvc.backendUrl.value;
      const req = httpMock.expectOne(`${baseUrl}/sessionmanager/v3/resetinactivity`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ sessionID: 'foo' });
      req.error(new ErrorEvent(''));

      expect(modal.message).toHaveBeenCalled();
      //expect(logSpy.error).toHaveBeenCalledTimes(1);

      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();
    });

    it('should handle already having the modal open', () => {
      modal.message.and.returnValue(new Subject<boolean>());

      connSvc.evaluateInactivity(119, 'foo');

      expect(modal.message).toHaveBeenCalledTimes(1);

      connSvc.evaluateInactivity(99, 'foo');

      // the modal shouldn't be launched again
      expect(modal.message).toHaveBeenCalledTimes(1);

      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();
      expect(logSpy.error).not.toHaveBeenCalled();
    });
  });

  describe('closeSession', () => {
    beforeEach(() => {
      connSvc.session = { sessionID: 'foo' } as Session;
      spyOn(connSvc, 'resetClientSession');
    });

    afterEach(() => {
      expect(connSvc.resetClientSession).toHaveBeenCalled();
    });

    it('should handle the happy case', () => {
      connSvc.closeSession();
      const req = httpMock.expectOne(`${connSvc.backendUrl.value}/sessionmanager/v3/closesession`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ sessionID: 'foo' });
      req.flush({});
      httpMock.expectNone(`${connSvc.backendUrl.value}/sessionmanager/v3/closesession`);
      const baseUrl = connSvc.backendUrl.value;
      httpMock.expectOne(request => request.url === `${baseUrl}/machine/v1/configuration`);
      httpMock.verify();
    //  expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should handle no session', () => {
      connSvc.session = undefined;

      connSvc.closeSession();

      httpMock.expectNone(`${connSvc.backendUrl.value}/sessionmanager/v3/closesession`);

      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();
    //  expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should handle an error w/ missing session', () => {
      const error = {
        errors: [
          {
            errorName: ConnectionErrorCode.sessionIDNotFound,
          },
        ],
      };

      connSvc.closeSession();

      const req = httpMock.expectOne(`${connSvc.backendUrl.value}/sessionmanager/v3/closesession`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ sessionID: 'foo' });

      req.error(error as any);

      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();

     // assertProcessError(store.dispatch as jasmine.Spy);
    });

    it('should handle an error', () => {
      const error = new ErrorEvent('');

      connSvc.closeSession();

      const req = httpMock.expectOne(`${connSvc.backendUrl.value}/sessionmanager/v3/closesession`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ sessionID: 'foo' });

      req.error(error);

      const url = `${connSvc.backendUrl.value}/machine/v1/configuration`;
      httpMock.expectOne(request => request.url === url);

      httpMock.verify();

     // assertProcessError(store.dispatch as jasmine.Spy);
    });
  });


});



function assertProcessError(dispatch: jasmine.Spy) {
  expect(dispatch).toHaveBeenCalledTimes(1);
 // expect(dispatch.calls.mostRecent().args[0].type).toEqual(processError.type);
}
