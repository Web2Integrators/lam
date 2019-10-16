import { Injectable } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';
import * as WaferflowListSelectors from './waferflow-list.selectors';
import { ExpresseWaferFlowState } from '../index';
import { Observable } from 'rxjs';
import { WaferflowListEntity, Facade } from './waferflow-list.models';

@Injectable()
export class WaferflowListFacade implements Facade {
  loaded$ = this.store.pipe(
    select(WaferflowListSelectors.getWaferflowListLoaded)
  );
  waferflowlist$: Observable<WaferflowListEntity> = this.store.pipe(
    select(WaferflowListSelectors.getWaferflowListEntity)
  );
  constructor(private store: Store<ExpresseWaferFlowState>) {
    this.waferflowlist$.subscribe(data => {
      console.log(data);
    });
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
