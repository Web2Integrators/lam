import {
  createSelector,
  createFeatureSelector,
  Action,
  combineReducers,
} from '@ngrx/store';

// tslint:disable-next-line:nx-enforce-module-boundaries
import {AppState} from '@lamresearch/lam-common-eager'
import * as  fromSession from './session.reducer'


export const sessionFeatureKey = 'session';

export interface SessionState {
  [fromSession.sessionBasicKey]: fromSession.State;
}

export interface State extends AppState {
  [sessionFeatureKey]: SessionState;
}

export function reducers(state: SessionState | undefined, action: Action) {
  return combineReducers({
    [fromSession.sessionBasicKey]: fromSession.reducer,

  })(state, action);
}

export const selectSessionState = createFeatureSelector<State, SessionState>(
  sessionFeatureKey
);

export const selectBasicSessionState = createSelector(
  selectSessionState,
  (state: SessionState) => state[fromSession.sessionBasicKey]
);

export const getSession = createSelector(selectBasicSessionState, fromSession.getSession);
