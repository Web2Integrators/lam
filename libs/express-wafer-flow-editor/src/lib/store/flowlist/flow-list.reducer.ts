import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as FlowListActions from './flow-list.actions';
import { FlowListEntity } from './flow-list.models';

export const FLOWLIST_FEATURE_KEY = 'flowList';

export interface FlowListState extends EntityState<FlowListEntity> {
  selectedId?: string | number; // which FlowList record has been selected
  loaded?: boolean; // has the FlowList list been loaded
  error?: string | null; // last none error (if any)
  flowlist?:any
}

export interface FlowListPartialState {
  readonly [FLOWLIST_FEATURE_KEY]: FlowListState;
}

export const flowListAdapter: EntityAdapter<
  FlowListEntity
> = createEntityAdapter<FlowListEntity>();

export const initialState: FlowListState = flowListAdapter.getInitialState({
  // set initial required properties
  loaded: false
});

const flowListReducer = createReducer(
  initialState,
  on(FlowListActions.loadFlowList, state => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(FlowListActions.loadFlowListSuccess, (state, { flowlist }) =>
   ( { ...state, loaded: true ,flowlist })
  ),
  on(FlowListActions.loadFlowListFailure, (state, { error }) => ({
    ...state,
    error
  }))
);

export function reducer(state: FlowListState | undefined, action: Action) {
  return flowListReducer(state, action);
}
