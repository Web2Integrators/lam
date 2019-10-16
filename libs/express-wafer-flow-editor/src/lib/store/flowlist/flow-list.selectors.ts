import {  createSelector } from '@ngrx/store';
import {  selectExpresseWaferFlowState, ExpresseWaferFlowType } from '../index';
import {
  FLOWLIST_FEATURE_KEY,
  FlowListState,

  flowListAdapter
} from './flow-list.reducer';

export const getFlowListState = createSelector(
  selectExpresseWaferFlowState,
  (state: ExpresseWaferFlowType) => state.flowList
);

// Lookup the 'FlowList' feature state managed by NgRx
// export const getFlowListState = createFeatureSelector<
//   FlowListPartialState,
//   FlowListState
//   >(FLOWLIST_FEATURE_KEY);


const { selectAll, selectEntities } = flowListAdapter.getSelectors();

export const getFlowList = createSelector(
  getFlowListState,
  (state: FlowListState) => {
   return state.flowlist
  }
);

//export const getIds = (state: FlowListState) => state.;



export const getFlowListLoaded = createSelector(
  getFlowListState,
  (state: FlowListState) => state.loaded
);

export const getFlowListError = createSelector(
  getFlowListState,
  (state: FlowListState) => state.error
);

export const getAllFlowList = createSelector(
  getFlowListState,
  (state: FlowListState) => selectAll(state)
);

export const getFlowListEntities = createSelector(
  getFlowListState,
  (state: FlowListState) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getFlowListState,
  (state: FlowListState) => state.selectedId
);

export const getSelected = createSelector(
  getFlowListEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
