import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LogService, Logger } from './log/log.service';

/**
 * An HTTP interceptor that logs all HTTP requests via the Logger.
 */
@Injectable()
export class HttpLoggingService implements HttpInterceptor {
  log?: Logger;

  constructor(private logService: LogService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Create logger lazily to avoid an infinite loop problem: If the logger is created in this
    // service's constructor, the debug message spawns an HTTP request in AjaxLogObserver. Since
    // this service has not finished constructing, a new instance of this service is created, and
    // thus another call to the constructor, resulting in an infinite loop.
    //
    if (!this.log) {
      const topic = 'HttpLoggingService';
      this.log = this.logService.createLogger(topic, { quiet: true });
      // Spawn the debug message *after* creating the logger so that this.log is defined when this
      // intercept function is called for the HTTP call spawned by that debug message.
      this.log.debug(`Created logger for topic "${topic}"`);
    }

    const reqString: string = `${req.method} ${req.urlWithParams}`;
    const started: number = Date.now();

    // Helper functions for success and error logging, to keep the observable pipeline cleaner and
    // easier to follow

    const logSuccess = (httpEvent: HttpEvent<any>) => {
      const elapsed: number = Date.now() - started;
      // Avoid some noise by ignoring { type: 0 } "Sent" events.
      if (httpEvent.type !== HttpEventType.Sent) {
        this.log!.debug(`HTTP event after ${elapsed}ms for ${reqString}`, httpEvent);
      }
    };

    const logError = (err: any) => {
      const elapsed: number = Date.now() - started;
      const errorType: string = err instanceof HttpErrorResponse ? 'HTTP' : 'Non-HTTP';
      this.log!.error(`${errorType} error after ${elapsed}ms for ${reqString}`, err);
    };

    this.log.debug(`HTTP request for ${reqString}`, req);

    return next.handle(req).pipe(tap(logSuccess, logError));
  }
}
