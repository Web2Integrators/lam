import { createReducer, on, Action } from '@ngrx/store';
import * as WaferflowListActions from './waferflow-list.actions';
import { WaferflowListEntity } from './waferflow-list.models';

export const WAFERFLOWLIST_FEATURE_KEY = 'waferflowList';

export interface WaferflowListState {
  WaferflowListEntity: WaferflowListEntity;
  loaded: boolean; // has the WaferflowList list been loaded
  error?: string | null; // last none error (if any)
  selectedCollection?:string
}

export const initialState: WaferflowListState = {
  // set initial required properties
  WaferflowListEntity: null,
  loaded: false,
  selectedCollection:"All"
};

const waferflowListReducer = createReducer(
  initialState,
  on(WaferflowListActions.loadWaferflowList, state => ({
    ...state,
    loaded: false,
    error: null,

  })),
  on(
    WaferflowListActions.loadWaferflowListSuccess,
    (state, { waferflowList }) => ({ ...state, loaded: true, WaferflowListEntity: waferflowList.data })
  ),
  on(WaferflowListActions.loadWaferflowListFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(WaferflowListActions.selectCollection, (state, { collectionName }) => ({
    ...state,
    selectedCollection: collectionName,
  }))
);

export function reducer(state: WaferflowListState | undefined, action: Action) {
  return waferflowListReducer(state, action);
}
