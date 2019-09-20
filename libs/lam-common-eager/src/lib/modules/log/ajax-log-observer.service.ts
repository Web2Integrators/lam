import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { bufferTime, filter, mergeMap, retry, takeUntil } from 'rxjs/operators';

import { LogObserverCreator } from '../../environments/environment-types';
import { LogItem, LogObserver } from './log.service';
import { getAbsoluteUrl } from './utils';

// Interval between batches in milliseconds
const LOG_BUFFER_TIME = 1000;

export interface AjaxLogObserverOptions {
  url: string;
}

export class AjaxLogObserver implements LogObserver, OnDestroy {
  url: string;
  ajaxItems: Subject<LogItem>;

  private unsubscribe = new Subject<void>();

  constructor(private http: HttpClient, options: AjaxLogObserverOptions) {
    this.url = options.url;
    this.ajaxItems = new Subject<any>();

    this.ajaxItems
      .pipe(
        // Send items to the server in batches to reduce the number of HTTP requests in flight.
        //
        bufferTime(LOG_BUFFER_TIME),
        filter((items: LogItem[]) => items.length > 0),
        // Send the array of log items to the server. Note: Apart from the timestamp and decycling,
        // there's no additional server-specific formatting or parsing. It's entirely up to the
        // server to decide what to do with the log items.
        //
        mergeMap((items: LogItem[]) => {
          const payload: any = this.formatReqPayload(items);
          return this.http.post(this.url, payload);
        }),
        // Log opportunistically: drop any messages that fail. More advanced error handling can be
        // added in a future version. Note: the operator is called "retry", but it really just
        // unsubscribes and resubscribes in the event of an error, which is what we want here.
        //
        retry(),
        takeUntil(this.unsubscribe),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  next(item: LogItem): void {
    // Do not spawn HTTP requests for logs caused by this observer else an infinite loop can occur.
    //
    if (getAbsoluteUrl(_.get(item, ['details', '0', 'url'])) === getAbsoluteUrl(this.url)) {
      return;
    }

    // Send item to batch queue.
    //
    this.ajaxItems.next(item);
  }

  /**
   * Override to format payload
   * @param payload Request payload
   */
  formatReqPayload(payload: LogItem[]): any {
    return payload.map((item: LogItem) => {
      // Convert the JS Date object timestamp into an ISO string before sending the log item to the
      // server, and decycle the whole thing so converting it to JSON doesn't crash.
      //

      const decycledItem = (JSON as any).decycle(item);
      return {
        ...decycledItem,
        timestamp: decycledItem.timestamp.toISOString(),
      };
    });
  }

  error(_err: any): void {}

  complete(): void {}
}

@Injectable({ providedIn: 'root' })
export class AjaxLogObserverService
  implements LogObserverCreator<AjaxLogObserver, AjaxLogObserverOptions> {
  constructor(private http: HttpClient) {}

  createObserver(options: AjaxLogObserverOptions): AjaxLogObserver {
    return new AjaxLogObserver(this.http, options);
  }
}
