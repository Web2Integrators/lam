import {
  createSelector,
  createFeatureSelector,
  Action,
  combineReducers,
} from '@ngrx/store';
//import * as fromRoot from '@example-app/reducers';
import * as  fromSession from './session.reducer'


export const sessionFeatureKey = 'session';

export interface SessionState {
  [fromSession.sessionBasicKey]: fromSession.State;

}

export interface State  {
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
