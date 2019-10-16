import { createReducer, on } from '@ngrx/store';
import { Session } from '../../types/types';
import { SessionActions } from '../actions';

export const sessionBasicKey = 'session-basic';

export interface State {
  session: Session | null;
}

export const initialState: State = {
  session: {
    sessionID :'2'
  },
};

export const reducer = createReducer(
  initialState,
  on(SessionActions.sessionCreate, (state, { session }) => (
    {
    ...state, session
  })),
);

export const getSession = (state: State) => {
  console.log(state.session);
 return state.session
};
