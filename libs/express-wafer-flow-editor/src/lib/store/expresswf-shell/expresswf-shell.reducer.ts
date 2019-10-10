import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as ExpresswfShellActions from './expresswf-shell.actions';
import { ExpresswfShellEntity } from './expresswf-shell.models';

export const EXPRESSWFSHELL_FEATURE_KEY = 'expresswfShell';

export interface ExpresswfShellState extends EntityState<ExpresswfShellEntity> {
  selectedId?: string | number; // which ExpresswfShell record has been selected
  loaded: boolean; // has the ExpresswfShell list been loaded
  error?: string | null; // last none error (if any)
}

export interface ExpresswfShellPartialState {
  readonly [EXPRESSWFSHELL_FEATURE_KEY]: ExpresswfShellState;
}

export const expresswfShellAdapter: EntityAdapter<
  ExpresswfShellEntity
> = createEntityAdapter<ExpresswfShellEntity>();

export const initialState: ExpresswfShellState = expresswfShellAdapter.getInitialState(
  {
    // set initial required properties
    loaded: false
  }
);

const expresswfShellReducer = createReducer(
  initialState,
  on(ExpresswfShellActions.loadExpresswfShell, state => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(
    ExpresswfShellActions.loadExpresswfShellSuccess,
    (state, { expresswfShell }) =>
      expresswfShellAdapter.addAll(expresswfShell, { ...state, loaded: true })
  ),
  on(ExpresswfShellActions.loadExpresswfShellFailure, (state, { error }) => ({
    ...state,
    error
  }))
);

export function reducer(
  state: ExpresswfShellState | undefined,
  action: Action
) {
  return expresswfShellReducer(state, action);
}
