import { NgModule } from '@angular/core';
import { Action } from '@ngrx/store';
//todo
//import { Actions } from '@ngrx/effects';

import { LogService, Logger } from '../log/log.service';

/**
 * Log every action dispatched to the store. Actions are logged under the 'ActionLoggingModule'
 * topic at the debug level.
 */
@NgModule()
export class ActionLoggingModule {
  //todo
  constructor(logService: LogService) {
    const log: Logger = logService.createLogger('ActionLoggingModule');

   // actions.subscribe((a: Action) => log.debug(`Processing action '${a.type}':`, a));
  }
}
