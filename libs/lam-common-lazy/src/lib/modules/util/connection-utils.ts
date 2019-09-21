import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { get } from 'lodash';
import { Observable, empty } from 'rxjs';


//import { PdeState, processError } from '../../pde/state/pde-state';
import { ConnectionErrorCode } from '../../session-manager/connection.service';
import { BackendError } from '../../types/types';

export interface BackendErrorStrategy<T> {
  predicate: (backendError: BackendError) => boolean;
  execute: (backendError: BackendError) => Observable<T>;
}

/**
 * Utility to extract the error name from an http error, if possible.
 */
export function extractErrorName(err: HttpErrorResponse) {
  return get(err, 'error.errors[0].errorName');
}

/**
 * Handle errors recived when interacting with the server. We dispatch an action for the system to
 * process the error, with special processing here if the error is in the shape that we expect
 * for an intential error message from the server, or if the error matches a strategy provided by
 * the caller.
 */
export function handleBackendError<T = never>(
  store: Store<PdeState>,
  err: any,
  backendStrategy?: BackendErrorStrategy<T>,
): Observable<T> {
  const backendError: BackendError = get(err, 'error.errors[0]') || {
    errorName: ConnectionErrorCode.unknown,
  };
  if (backendStrategy && backendStrategy.predicate(backendError)) {
    // if there's a custom strategy and it matches, then use it...
    return backendStrategy.execute(backendError);
  }
  if (backendError.errorName !== ConnectionErrorCode.unknown) {
    // ...otherwise process the error in the default way
    const name: string = backendError.errorName;
    const title: string = 'Error: ' + name;
    const message: string = backendError.description;
    const details: any = (JSON as any).decycle(backendError.details);
    const canProceed: boolean = backendError.details && backendError.details.canProceed;
    store.dispatch(processError(title, message, details, canProceed));
  } else {
    store.dispatch(
      processError('Http Error', 'Error posting to server', (JSON as any).decycle(err), false),
    );
  }
  return empty();
}
