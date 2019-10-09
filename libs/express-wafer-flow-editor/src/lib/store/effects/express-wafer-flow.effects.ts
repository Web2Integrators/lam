import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  concatMap,
  tap,
  withLatestFrom,
  take,
  mapTo,
  switchMap,
  mergeMap,
  filter
} from 'rxjs/operators';
import { EMPTY, of, Observable, OperatorFunction } from 'rxjs';

import * as ExpressWaferFlowActions from '../actions/express-wafer-flow.actions';
import { Action, Store, select } from '@ngrx/store';
import { getSession } from '@lamresearch/session-manager';
import { HttpClient } from '@angular/common/http';

export interface ActionWithPayload<T> extends Action {
  payload: T;
}
const backendPort = '18072';
const nextBackendUrl = `${'http://localhost'}:${backendPort}`;
@Injectable()
export class ExpressWaferFlowEffects {


  loadExpressWaferFlows$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpressWaferFlowActions.loadExpressWaferFlows),
      withLatestFrom(this.store.pipe(select(getSession))),
      switchMap(([action, session]) => this.postAction(action, session)),
      tap(r =>console.log(r)),
      map((express: any) => {
        console.log(express);
       return ExpressWaferFlowActions.loadExpressWaferFlowsSuccess({express})
      }),
    ),
  );

  postAction(action: any,session): Observable<any> {
    console.log(action);
   const sessionObj = {
    sessionID: session.sessionID,
    lockNames: ['WaferflowEditor'],
    }
    return this.http
      .post<Response>(`${nextBackendUrl}/waferflow/v1/initialize`, sessionObj)
      .pipe(
        tap((res: Response) =>
          console.log(`Received response to  action:`, res)
        )
      );
  }

  constructor(
    private actions$: Actions,
    public store: Store<{}>,
    private http: HttpClient
  ) {}
}
