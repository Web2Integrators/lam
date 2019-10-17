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
  getWaferflowListEntity$: Observable<WaferflowListEntity> = this.store.pipe(
    select(WaferflowListSelectors.getWaferflowListEntity)
  );
  collectionNames$: Observable<string[]> = this.store.pipe(
    select(WaferflowListSelectors.getCollectionNames)
  );

  waferFlowList$: Observable<any> = this.store.pipe(
    select(WaferflowListSelectors.getWaferFlowList)
  );
  constructor(private store: Store<ExpresseWaferFlowState>) {

  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
