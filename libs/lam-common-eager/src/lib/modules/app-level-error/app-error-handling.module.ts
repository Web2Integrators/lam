import { ErrorHandler, Injectable, NgModule } from '@angular/core';

import { LogService, Logger } from '../log/log.service';

// Install the global handler to log Angular application errors that aren't handled deeper in the
// stack.

// XXX: Other kinds of global error logging will probably be added here in the future.

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private readonly log: Logger;

  constructor(logService: LogService) {
    this.log = logService.createLogger('AppErrorHandler');

    // XXX: No sense logging anything here just yet, since the log observers aren't initialized yet.
    // Might be able to fix that with smarter use of providers.
    //
    // this.log.debug('Installing Angular global AppErrorHandler');
  }

  handleError(error: any) {
    this.log.error('Application Error:', error);
  }
}

@NgModule({
 // providers: [{ provide: ErrorHandler, useClass: AppErrorHandler }],
})
export class AppErrorHandlingModule {}
