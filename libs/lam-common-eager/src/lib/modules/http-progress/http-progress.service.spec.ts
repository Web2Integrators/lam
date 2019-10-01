//TODO
import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
} from '@angular/common/http';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Subject } from 'rxjs';
import { HttpProgressService, SLOW_REQUEST_TIME, isLoggerUrl } from './http-progress.service';
import { AppState, reducers, incrementPendingRequests, decrementPendingRequests } from '../../sharedArtifcats/app-state';
import { Environment } from '../../sharedArtifcats/environment-types';
import { ConsoleLogObserverService } from '../log/console-log-observer.service';
import { LogLevel } from '../log/log.service';
import { apiEndpoints } from '../../sharedArtifcats/shared';

export const environment: Environment = {
  production: false,
  logObservers: [
    {
      creator: ConsoleLogObserverService,
      level: LogLevel.debug,
    },
    {
      //Todo
      creator: ConsoleLogObserverService,
      level: LogLevel.error,
      options: { url: apiEndpoints.log.node }, // By Default it sends logs to Node
    },
  ],

  disabledFeatures: {},
};

describe('HttpProgressService', () => {
  describe('method', () => {
    let svc: HttpProgressService;
    let store: Store<AppState>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [HttpProgressService, {
          provide: 'envConfig',
          useValue: environment
        }],
        imports: [
          StoreModule.forRoot(reducers, {
            runtimeChecks: {
              strictStateImmutability: true,
              strictActionImmutability: true,
              strictStateSerializability: false,
              strictActionSerializability: true,
            },
          }),
        ],
      });

      svc = TestBed.get(HttpProgressService);
      store = TestBed.get(Store);

      spyOn(store, 'dispatch').and.callThrough();
    });

    describe('intercept', () => {
      let req: HttpRequest<any>;
      let sentEvent: HttpSentEvent;
      let otherEvent: HttpResponse<any>;
      let response: Subject<HttpEvent<any>>;
      let handler: HttpHandler;

      beforeEach(() => {
        req = { url: 'foo' } as HttpRequest<any>;
        sentEvent = { type: HttpEventType.Sent };
        otherEvent = new HttpResponse();
        response = new Subject<HttpEvent<any>>();
        handler = {
          handle: jasmine.createSpy().and.returnValue(response),
        };
      });

      it('should handle a slow request', fakeAsync(() => {
        svc.intercept(req, handler).subscribe();

        expect(handler.handle).toHaveBeenCalledWith(req);
        response.next(sentEvent);
        tick(SLOW_REQUEST_TIME - 1);
        expect(store.dispatch).not.toHaveBeenCalled();
        tick(2);
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(incrementPendingRequests());
        response.next(otherEvent);
        response.complete();
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith(decrementPendingRequests());
      }));

      it('should handle a fast request', fakeAsync(() => {
        svc.intercept(req, handler).subscribe();

        expect(handler.handle).toHaveBeenCalledWith(req);
        response.next(sentEvent);
        tick(SLOW_REQUEST_TIME - 1);
        expect(store.dispatch).not.toHaveBeenCalled();
        response.next(otherEvent);
        response.complete();
        expect(store.dispatch).not.toHaveBeenCalled();
      }));

      it('should handle a logger request', done => {
        req = { url: 'log' } as HttpRequest<any>;
        const result = svc.intercept(req, handler);

        expect(handler.handle).toHaveBeenCalledWith(req);
        result.subscribe(value => {
          expect(value).toBe(sentEvent);
          done();
        });
        response.next(sentEvent);
        response.complete();
      });
    });
  });

  describe('function', () => {
    it('should handle the logger url', () => {
      // note - this depends on the environment.ts current properties
      expect(isLoggerUrl('log', environment.logObservers)).toBe(true);
    });

    it('should handle not the logger url', () => {
      expect(isLoggerUrl('foo', environment.logObservers)).toBe(false);
    });

    it('should handle undefined url', () => {
      expect(isLoggerUrl(undefined!, environment.logObservers)).toBe(false);
    });

    it('should handle no observers', () => {
      expect(isLoggerUrl('log')).toBe(false);
    });
  });
});
