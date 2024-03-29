import { NgModule, Inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppErrorHandlingModule } from '../app-level-error/app-error-handling.module';

import { HttpProgressModule } from '../http-progress/http-progress.module';
import { InstanceIdentifierModule } from '../instance-identifier/instance-identifier.module';
import { LogModule } from '../log/log.module';
import { ActionLoggingModule } from '../store/action-logging.module';
import { HttpLoggingModule } from '../http-logging/http-logging.module';

import { filter } from 'rxjs/operators';
import { Environment, LogObserverDef } from '../../sharedArtifcats/environment-types';
import { LogEntries, LogService, Logger, LogItem } from '../log/log.service';
import { RootComponent } from './componentContainers/root/root.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material';
import { ModalModule } from '@lamresearch/lam-common-lazy';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { StoreRouterConnectingModule, RouterState } from '@ngrx/router-store';
import { ROOT_REDUCERS } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';


const MAX_STORE_STATES = 25;
const eagerModules = [
  CommonModule,
  AppErrorHandlingModule,
  HttpProgressModule,
  InstanceIdentifierModule,
  LogModule,
  ActionLoggingModule,
  HttpLoggingModule
]
//todo:whywe need MatDialog here
@NgModule({
  declarations: [RootComponent],
  imports: [...eagerModules, RouterModule, MatDialogModule, ModalModule,
    StoreModule.forRoot(ROOT_REDUCERS, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: false, // TODO: state is not serializable
        strictActionSerializability: false, // TODO: some actions are not serializable
      },
    }),
    StoreRouterConnectingModule.forRoot({
      routerState: RouterState.Minimal,
    }),
    StoreDevtoolsModule.instrument({ maxAge: MAX_STORE_STATES }),
    EffectsModule.forRoot([]),
 ],
  exports : [... eagerModules,RootComponent]
})
export class LamCommonEagerModule {
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
