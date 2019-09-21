import { Type } from '@angular/core';
import { LogObserver, LogLevel } from '../modules/log/log.service';



export interface LogObserverCreator<T extends LogObserver, P> {
  createObserver: (options: P) => T;
}

export interface LogObserverDef<P> {
  creator: Type<LogObserverCreator<LogObserver, P>>;
  level: LogLevel;
  options?: P;
}

export interface Environment {
  production?: boolean;
  logObservers?: LogObserverDef<any>[];
  // a true will mean that the feature is disabled
  disabledFeatures: Record<string, boolean>;
}
