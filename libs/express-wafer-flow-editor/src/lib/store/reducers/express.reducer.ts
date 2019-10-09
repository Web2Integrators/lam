import { createReducer, on } from '@ngrx/store';
import * as ExpressWaferFlowActions from '../actions/express-wafer-flow.actions';

export const expressBasicKey = 'express-basic';

export interface State {
  express: any | null;
}

export const initialState: State = {
  express: {test:'ghg'},
};

export const reducer = createReducer(
  initialState,
  on(ExpressWaferFlowActions.loadExpressWaferFlows, state => state),
  on(ExpressWaferFlowActions.loadExpressWaferFlowsSuccess, (state, { express }) => (
  {
   ...state, express
  })),
);

export const getExpress = (state: State) => {
  console.log(state.express);
 return state.express
};
