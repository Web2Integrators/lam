import {
  createFeatureSelector,
  Action,
  combineReducers,
  createSelector,
} from '@ngrx/store';

// tslint:disable-next-line:nx-enforce-module-boundaries
import {AppState} from '@lamresearch/lam-common-eager'
import *  as fromFlowList from './flowlist/flow-list.reducer';
import * as fromExpressWfShell from './expresswf-shell/expresswf-shell.reducer';

export const expressWafwerFlowFeaturekey = 'ewfe';

export interface ExpresseWaferFlowState {
  [fromFlowList.FLOWLIST_FEATURE_KEY]: fromFlowList.FlowListState;
  [fromExpressWfShell.EXPRESSWFSHELL_FEATURE_KEY]: fromExpressWfShell.ExpresswfShellState;
}

export interface State extends AppState {
  [expressWafwerFlowFeaturekey]: ExpresseWaferFlowState;
}

export function reducers(state: ExpresseWaferFlowState | undefined, action: Action) {
  return combineReducers({
    [fromFlowList.FLOWLIST_FEATURE_KEY]: fromFlowList.reducer,
    [fromExpressWfShell.EXPRESSWFSHELL_FEATURE_KEY]: fromExpressWfShell.reducer
  })(state, action);
}

export const selectExpresseWaferFlowState = createFeatureSelector<State, ExpresseWaferFlowState>(expressWafwerFlowFeaturekey);


export const getFlowListState = createSelector(
  selectExpresseWaferFlowState,
  (state: ExpresseWaferFlowState) => state[fromFlowList.FLOWLIST_FEATURE_KEY]
);
