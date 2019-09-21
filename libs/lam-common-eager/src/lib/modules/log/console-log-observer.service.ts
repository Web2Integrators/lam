import { Injectable } from '@angular/core';


import { LogItem, LogLevel, LogObserver } from './log.service';
import { LogObserverCreator } from '../../sharedArtifcats/environment-types';

export class ConsoleLogObserver implements LogObserver {
  // Print the log message (prefixed with the topic) and details (if any) to the console using the
  // console method corresponding to the name of the log level. If there's no method that matches
  // the log level, default to console.log().
  //
  next(item: LogItem): void {
    const levelName: string = LogLevel[item.level];
    const methodName: string = (console as any)[levelName] ? levelName : 'log';

    (console as any)[methodName](`[${item.topic}] ${item.message}`, item.details);
  }

  error(_err: any): void {}

  complete(): void {}
}

@Injectable({ providedIn: 'root' })
export class ConsoleLogObserverService implements LogObserverCreator<ConsoleLogObserver, void> {
  createObserver(): ConsoleLogObserver {
    return new ConsoleLogObserver();
  }
}
