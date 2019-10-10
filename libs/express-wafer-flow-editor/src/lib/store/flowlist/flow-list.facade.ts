import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromFlowList from './flow-list.reducer';
import * as FlowListSelectors from './flow-list.selectors';
import * as FlowListActions from './flow-list.actions';

@Injectable()
export class FlowListFacade {
  loaded$ = this.store.pipe(select(FlowListSelectors.getFlowListLoaded));
  allFlowList$ = this.store.pipe(select(FlowListSelectors.getAllFlowList));
  selectedFlowList$ = this.store.pipe(select(FlowListSelectors.getSelected));
  flowlist$ = this.store.pipe(select(FlowListSelectors.getFlowList));
  constructor(private store: Store<any>) {
    this.store.dispatch(FlowListActions.loadFlowList());
  }

  loadAll() {
   // this.store.dispatch(FlowListActions.loadFlowList());
  }
}
