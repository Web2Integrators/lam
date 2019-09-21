import { Injector, NgModule, Inject } from '@angular/core';
import { filter } from 'rxjs/operators';

import { ActionLoggingModule } from '../store/action-logging.module';
import { HttpLoggingModule } from '../http-logging/http-logging.module';
import { LogModule } from '../log/log.module';
import { LogEntries, LogItem, LogService, Logger } from '../log/log.service';
import { LogObserverDef, Environment } from '../../sharedArtifcats/environment-types';

@NgModule({
  imports: [LogModule, ActionLoggingModule, HttpLoggingModule],
})
export class AppLoggingModule {
  constructor(@Inject('envConfig') environment: Environment,logEntries: LogEntries, logService: LogService, injector: Injector) {
    const log: Logger = logService.createLogger('AppLoggingModule');

    // Set up any log observers defined in the environment.
    //
    if (environment.logObservers) {
      environment.logObservers.forEach((definition: LogObserverDef<any>) => {
        // Use the Angular injector to retrieve the log-observer-creator provider dynamically, so
        // every possible provider that might be mentioned in the environment doesn't also have to
        // be included in the constructor signature.
        //
        const creator = injector.get(definition.creator);
        const observer = creator.createObserver(definition.options);

        logEntries
          .pipe(
            // Only output items at or beyond the specified severity level.
            filter((item: LogItem) => item.level <= definition.level),
          )
          .subscribe(observer);

        // Note that there are no `unsubscribe` calls for these log subscriptions, because there's
        // not yet a place to unsubscribe that makes sense. That might change in the future if, for
        // example, we start to take advantage of Angular Elements <https://git.io/fN74D>.

        log.debug(`Initialized "${observer.constructor.name}" log observer`, {
          options: definition.options,
        });
      });
    }
  }
}
