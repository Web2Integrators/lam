import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  EXPRESSWFSHELL_FEATURE_KEY,
  ExpresswfShellState,
  ExpresswfShellPartialState,
  expresswfShellAdapter
} from './expresswf-shell.reducer';

// Lookup the 'ExpresswfShell' feature state managed by NgRx
export const getExpresswfShellState = createFeatureSelector<
  ExpresswfShellPartialState,
  ExpresswfShellState
>(EXPRESSWFSHELL_FEATURE_KEY);

const { selectAll, selectEntities } = expresswfShellAdapter.getSelectors();

export const getExpresswfShellLoaded = createSelector(
  getExpresswfShellState,
  (state: ExpresswfShellState) => state.loaded
);

export const getExpresswfShellError = createSelector(
  getExpresswfShellState,
  (state: ExpresswfShellState) => state.error
);

export const getAllExpresswfShell = createSelector(
  getExpresswfShellState,
  (state: ExpresswfShellState) => selectAll(state)
);

export const getExpresswfShellEntities = createSelector(
  getExpresswfShellState,
  (state: ExpresswfShellState) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getExpresswfShellState,
  (state: ExpresswfShellState) => state.selectedId
);

export const getSelected = createSelector(
  getExpresswfShellEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
