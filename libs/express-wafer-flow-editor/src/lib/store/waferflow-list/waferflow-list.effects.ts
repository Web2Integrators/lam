import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as WaferflowListActions from './waferflow-list.actions';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { tap, withLatestFrom, switchMap, map } from 'rxjs/operators';
import { WaferflowListEntity } from './waferflow-list.models';
import { getSession } from '@lamresearch/session-manager';
import { Observable } from 'rxjs';

const backendPort = '18072';
const nextBackendUrl = `${'http://localhost'}:${backendPort}`;

@Injectable()
export class WaferflowListEffects {
  loadWaferFlowList$ = createEffect(() =>
  this.actions$.pipe(
    ofType(WaferflowListActions.loadWaferflowList),
    withLatestFrom(this.store.pipe(select(getSession))),
    switchMap(([action, session]) => this.postAction(action, session)),
    tap(r =>console.log(r)),
    map((express: any) => {
      console.log(express);
      const waferflowList: WaferflowListEntity = {};
      waferflowList.data = express;
       return WaferflowListActions.loadWaferflowListSuccess({ waferflowList });
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
  private http: HttpClient,
  private actions$: Actions,
  public store: Store<{}>,
) {}
}
