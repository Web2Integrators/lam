import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { partial } from 'lodash';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { LogObserverDef } from '../environments/environment-types';
import { getAbsoluteUrl } from './log/utils';
import { incrementPendingRequests, decrementPendingRequests } from './app-state';

export const SLOW_REQUEST_TIME: number = 1000; // milliseconds

/**
 * Determine whether the given URL is a logging endpoint based on whether it matches any of the
 * log observers' URLs.
 *
 * @param reqUrl The (not necessarily absolute) url of the current request
 * @param logObservers The LogObserver definitions used to create the LogObservers
 */
export function isLoggerUrl(reqUrl: string, logObservers?: LogObserverDef<any>[]): boolean {
  if (!logObservers) {
    return false;
  }

  const isUrlMatchedByObserver = partial(loMatchesAbsoluteUrl, getAbsoluteUrl(reqUrl));
  return logObservers.some(isUrlMatchedByObserver);
}

/**
 * Determine whether the log observer is handling the url for the current request, based on whether
 * both have equivalent absolute urls.
 *
 * @param reqAbsoluteUrl The absolute url for the current request
 * @param logObserver A logObserver, which might be handling the request
 */
export function loMatchesAbsoluteUrl(
  reqAbsoluteUrl: string,
  logObserver: LogObserverDef<any>,
): boolean {
  const loUrl = logObserver.options && logObserver.options.url;
  return !!loUrl && getAbsoluteUrl(String(loUrl)) === reqAbsoluteUrl;
}

// Set of endpoint calls to run in the background. Items are removed after they are called/triggered
const backgroundTaskUrls = new Set<string>();
// Set of endpoint calls to run in the background. Items will always be background calls.
const persistentBackgroundTaskUrls = new Set<string>();

@Injectable()
export class HttpProgressService implements HttpInterceptor {
  constructor(private injector: Injector) {}

  /**
   * Mark all future HTTP requests to this URL as background tasks, which prevent the
   * loading spinner from displaying for the request.
   * @param url the URL to mark as a background request
   */
  static registerBackgroundTaskUrl(url: string) {
    persistentBackgroundTaskUrls.add(url);
  }

  /**
   * Mark the next HTTP request to this URL as a background task, which prevents the
   * loading spinner from displaying for the request.
   * @param url the URL to mark as a background request
   */
  static registerBackgroundTaskUrlOnce(url: string) {
    backgroundTaskUrls.add(url);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Do not consider log messages to be pending requests else the user will be annoyed by a
    // spinner on screen if the logging server is down.
    //
    let backgroundRequest = isLoggerUrl(req.url, environment.logObservers);

    const store = this.injector.get(Store);

    let t: NodeJS.Timer;

    if (backgroundTaskUrls.has(req.url)) {
      backgroundRequest = true;
      backgroundTaskUrls.delete(req.url);
    }
    if (persistentBackgroundTaskUrls.has(req.url)) {
      backgroundRequest = true;
    }

    if (backgroundRequest) {
      return next.handle(req);
    }

    let slowRequest = false;

    function addSlowRequest() {
      slowRequest = true;
      store.dispatch(incrementPendingRequests());
    }

    return next.handle(req).pipe(
      tap(() => {
        // initialize a timeout period when we initially send the request, but not for responses
        if (!t && !backgroundRequest) {
          t = setTimeout(addSlowRequest, SLOW_REQUEST_TIME);
        }
      }),
      finalize(() => {
        // clear the timeout, so a fast request will be stopped from incrementing the pending
        // request count
        clearTimeout(t);
        if (slowRequest) {
          // if the request was slow enough to have incremented the pending request count,
          // decrement it now
          store.dispatch(decrementPendingRequests());
        }
      }),
    );
  }
}
