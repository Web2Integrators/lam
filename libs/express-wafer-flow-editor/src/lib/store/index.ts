import {
  createFeatureSelector,
  Action,
  combineReducers,
 } from '@ngrx/store';

// tslint:disable-next-line:nx-enforce-module-boundaries
import {AppState} from '@lamresearch/lam-common-eager'
import *  as fromWaferFlowList from './waferflow-list/waferflow-list.reducer';
import * as fromExpressWfShell from './expresswf-shell/expresswf-shell.reducer';

export const expressWafwerFlowFeaturekey = 'ewfe';

export interface ExpresseWaferFlowType {
  [fromWaferFlowList.WAFERFLOWLIST_FEATURE_KEY]: fromWaferFlowList.WaferflowListState;
  [fromExpressWfShell.EXPRESSWFSHELL_FEATURE_KEY]: fromExpressWfShell.ExpresswfShellState;
}

export interface ExpresseWaferFlowState extends AppState {
  [expressWafwerFlowFeaturekey]: ExpresseWaferFlowType;
}

export function reducers(state: ExpresseWaferFlowType | undefined, action: Action) {
  return combineReducers({
    [fromWaferFlowList.WAFERFLOWLIST_FEATURE_KEY]: fromWaferFlowList.reducer,
    [fromExpressWfShell.EXPRESSWFSHELL_FEATURE_KEY]: fromExpressWfShell.reducer
  })(state, action);
}

export const selectExpresseWaferFlowState = createFeatureSelector<ExpresseWaferFlowState, ExpresseWaferFlowType>(expressWafwerFlowFeaturekey);



