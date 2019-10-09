import {
  createSelector,
  createFeatureSelector,
  Action,
  combineReducers,
} from '@ngrx/store';

// tslint:disable-next-line:nx-enforce-module-boundaries
import {AppState} from '@lamresearch/lam-common-eager'
import * as  fromExpresseWaferFlow from './express.reducer'


export const expressWafwerFlowFeaturekey = 'ewfe';

export interface ExpresseWaferFlowState {
  [fromExpresseWaferFlow.expressBasicKey]: fromExpresseWaferFlow.State;
}

export interface State extends AppState {
  [expressWafwerFlowFeaturekey]: ExpresseWaferFlowState;
}

export function reducers(state: ExpresseWaferFlowState | undefined, action: Action) {
  return combineReducers({
    [fromExpresseWaferFlow.expressBasicKey]: fromExpresseWaferFlow.reducer,

  })(state, action);
}

export const selectExpressnState = createFeatureSelector<State, ExpresseWaferFlowState>(
  expressWafwerFlowFeaturekey
);

export const selectBasicExpressState = createSelector(
  selectExpressnState,
  (state: ExpresseWaferFlowState) => state[fromExpresseWaferFlow.expressBasicKey]
);

export const getExpress = createSelector(selectBasicExpressState, fromExpresseWaferFlow.getExpress);
