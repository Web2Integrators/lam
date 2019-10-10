import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

//import { FlowListPartialState } from './flow-list.reducer';
import * as FlowListActions from './flow-list.actions';


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


import { Action, Store, select } from '@ngrx/store';
import { getSession } from '@lamresearch/session-manager';
import { HttpClient } from '@angular/common/http';

export interface ActionWithPayload<T> extends Action {
  payload: T;
}
const backendPort = '18072';
const nextBackendUrl = `${'http://localhost'}:${backendPort}`;

@Injectable()
export class FlowListEffects {


  loadExpressWaferFlows$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FlowListActions.loadFlowList),
      withLatestFrom(this.store.pipe(select(getSession))),
      switchMap(([action, session]) => this.postAction(action, session)),
      tap(r =>console.log(r)),
      map((express: any) => {
        console.log(express);
        const flowlist = express.simpleFlowsList;
         return FlowListActions.loadFlowListSuccess({ flowlist });
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


  // loadFlowList$ = createEffect(() =>
  //   this.dataPersistence.fetch(FlowListActions.loadFlowList, {
  //     run: (
  //       action: ReturnType<typeof FlowListActions.loadFlowList>,
  //       state: FlowListPartialState
  //     ) => {
  //       // Your custom service 'load' logic goes here. For now just return a success action...
  //       return FlowListActions.loadFlowListSuccess({ flowList: [] });
  //     },

  //     onError: (
  //       action: ReturnType<typeof FlowListActions.loadFlowList>,
  //       error
  //     ) => {
  //       console.error('Error', error);
  //       return FlowListActions.loadFlowListFailure({ error });
  //     }
  //   })
  // );

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    public store: Store<{}>,

  ) {}
}
