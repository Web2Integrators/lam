// import { HttpErrorResponse } from '@angular/common/http';
// import { Store } from '@ngrx/store';
// import { get } from 'lodash';
// import { Observable, of } from 'rxjs';

// import { BackendError } from '../../pde/pde-types';
// //import { PdeState, ProcessError } from '../../pde/state/pde-state';

// export interface BackendErrorStrategy {
//   predicate: (backendError: BackendError) => boolean;
//   execute: (backendError: BackendError) => Observable<any>;
// }

// /**
//  * Utility to extract the error name from an http error, if possible.
//  */
// export function extractErrorName(err: HttpErrorResponse) {
//   return get(err, 'error.errors[0].errorName');
// }

// /**
//  * Handle errors recived when interacting with the server. We dispatch an action for the system to
//  * process the error, with special processing here if the error is in the shape that we expect
//  * for an intential error message from the server, or if the error matches a strategy provided by
//  * the caller.
//  */
// export function handleBackendError(
//   store: Store<PdeState>,
//   err: any,
//   backendStrategy?: BackendErrorStrategy
// ): Observable<any> {
//   const backendError: BackendError = get(err, 'error.errors[0]');

//   if (backendError) {
//     if (backendStrategy && backendStrategy.predicate(backendError)) {
//       // if there's a custom strategy and it matches, then use it...
//       return backendStrategy.execute(backendError);
//     } else {
//       // ...otherwise process the error in the default way
//       const name: string = backendError.errorName;
//       const title: string = 'Error: ' + name;
//       const message: string = backendError.description;
//       const details: any = (JSON as any).decycle(backendError.details);
//       const canProceed: boolean = backendError.details && backendError.details.canProceed;
//       store.dispatch(new ProcessError(title, message, details, canProceed));
//     }
//   } else {
//     store.dispatch(new ProcessError('Http Error', 'Error posting to server', err, false));
//   }
//   return of(undefined);
// }
