import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as CarsActions from './cars.actions';
import { CarsEntity } from './cars.models';

export const CARS_FEATURE_KEY = 'cars';

export interface CarsState extends EntityState<CarsEntity> {
  selectedId?: string | number; // which Cars record has been selected
  loaded: boolean; // has the Cars list been loaded
  error?: string | null; // last none error (if any)
}

export interface CarsPartialState {
  readonly [CARS_FEATURE_KEY]: CarsState;
}

export const carsAdapter: EntityAdapter<CarsEntity> = createEntityAdapter<
  CarsEntity
>();

export const initialState: CarsState = carsAdapter.getInitialState({
  // set initial required properties
  loaded: false
});

const carsReducer = createReducer(
  initialState,
  on(CarsActions.loadCars, state => ({ ...state, loaded: false, error: null })),
  on(CarsActions.loadCarsSuccess, (state, { cars }) =>
    carsAdapter.addAll(cars, { ...state, loaded: true })
  ),
  on(CarsActions.loadCarsFailure, (state, { error }) => ({ ...state, error }))
);

export function reducer(state: CarsState | undefined, action: Action) {
  return carsReducer(state, action);
}
