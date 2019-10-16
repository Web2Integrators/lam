import { Injectable } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';
import * as FlowListSelectors from './flow-list.selectors';
import { Facade } from './flow-list.models';
import { ExpresseWaferFlowState } from '../index';

@Injectable()
export class FlowListFacade implements Facade {

  loaded$ = this.store.pipe(select(FlowListSelectors.getFlowListLoaded));
  allFlowList$ = this.store.pipe(select(FlowListSelectors.getAllFlowList));
  selectedFlowList$ = this.store.pipe(select(FlowListSelectors.getSelected));
  flowlist$ = this.store.pipe(select(FlowListSelectors.getFlowList));


  constructor(private store: Store<ExpresseWaferFlowState>) {
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

}
