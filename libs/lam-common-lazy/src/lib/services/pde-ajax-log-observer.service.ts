import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';

import { LogObserverCreator } from '../../environments/environment-types';
import { LogItem, LogObserver, LogLevel } from '../log/log.service';
import { AjaxLogObserver, AjaxLogObserverOptions } from '../log/ajax-log-observer.service';
import { apiEndpoints } from '../common/shared';
//import { ElectronService } from '../electron.service';

export class PdeAjaxLogObserver extends AjaxLogObserver implements LogObserver {
  isBackendLogging = false;

  constructor(
    http: HttpClient,
    options: AjaxLogObserverOptions,
    private electronService: ElectronService,
  ) {
    super(http, options);
    if (electronService.isElectron()) {
      this.checkForBackendLogging();
    }
  }

  async checkForBackendLogging() {
    const { backendLogging, backendUrl } = await this.electronService.getBackendLoggingConfig();
    if (backendLogging && backendUrl) {
      this.url = `${backendUrl}${apiEndpoints.log.backend}`;
      this.isBackendLogging = true;
    }
  }

  formatReqPayload(items: LogItem[]): any {
    return this.isBackendLogging
      ? { messages: items.map(this.formatBackendLogItem) }
      : super.formatReqPayload(items);
  }

  formatBackendLogItem(item: LogItem): any {
    const payloadItem = {
      message: JSON.stringify({
        summary: item.message,
        details: item.details,
      }),
      timestamp: item.timestamp.getTime(),
      source: `PDE-${item.topic}`,
      level: LogLevel[item.level],
      category: 'PDE',
    };
    return (JSON as any).decycle(payloadItem);
  }
}

@Injectable({ providedIn: 'root' })
export class PdeAjaxLogObserverService
  implements LogObserverCreator<PdeAjaxLogObserver, AjaxLogObserverOptions> {
  constructor(private http: HttpClient, private electronService: ElectronService) {}

  createObserver(options: AjaxLogObserverOptions): PdeAjaxLogObserver {
    return new PdeAjaxLogObserver(this.http, options, this.electronService);
  }
}
