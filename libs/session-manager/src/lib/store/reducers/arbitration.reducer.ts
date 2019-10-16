import { Action, createReducer, on } from '@ngrx/store';

export const arbitrationFeatureKey = 'arbitration';

export interface State {
  resourceName: string
}

export const initialState: State = {
  resourceName :'WaferflowEditor'
};

export const reducer = createReducer(
  initialState,
);


