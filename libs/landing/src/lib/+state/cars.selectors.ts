import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  CARS_FEATURE_KEY,
  CarsState,
  CarsPartialState,
  carsAdapter
} from './cars.reducer';

// Lookup the 'Cars' feature state managed by NgRx
export const getCarsState = createFeatureSelector<CarsPartialState, CarsState>(
  CARS_FEATURE_KEY
);

const { selectAll, selectEntities } = carsAdapter.getSelectors();

export const getCarsLoaded = createSelector(
  getCarsState,
  (state: CarsState) => state.loaded
);

export const getCarsError = createSelector(
  getCarsState,
  (state: CarsState) => state.error
);

export const getAllCars = createSelector(
  getCarsState,
  (state: CarsState) => selectAll(state)
);

export const getCarsEntities = createSelector(
  getCarsState,
  (state: CarsState) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getCarsState,
  (state: CarsState) => state.selectedId
);

export const getSelected = createSelector(
  getCarsEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
