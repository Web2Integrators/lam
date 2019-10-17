import { createSelector } from '@ngrx/store';
import { selectExpresseWaferFlowState, ExpresseWaferFlowType } from '../index';
import { WaferflowListState } from './waferflow-list.reducer';
import { selectCollection } from './waferflow-list.actions';

export const getWaferflowListState = createSelector(
  selectExpresseWaferFlowState,
  (state: ExpresseWaferFlowType) => state.waferflowList
);

export const getWaferflowListEntity = createSelector(
  getWaferflowListState,
  (state: WaferflowListState) => state.WaferflowListEntity
);

export const getWaferflowListLoaded = createSelector(
  getWaferflowListState,
  (state: WaferflowListState) => state.loaded
);

export const getWaferflowListError = createSelector(
  getWaferflowListState,
  (state: WaferflowListState) => state.error
);

export const getSelectedCollection = createSelector(
  getWaferflowListState,
  (state: WaferflowListState) => state.selectedCollection
);

export const getCollectionNames = createSelector(
  getWaferflowListState,
  (state: WaferflowListState) => {
    if (state.WaferflowListEntity)
      return [
        'All',
        ...Object.keys(state.WaferflowListEntity['folderWithFlownames'])
      ];
  }
);

export const getWaferFlowList = createSelector(
  getWaferflowListState,
  getSelectedCollection,
  (state, selectedCollection) => {
    if (state.WaferflowListEntity) {
      let ret = [];
      if (selectedCollection == 'All') {
        Object.keys(state.WaferflowListEntity['folderWithFlownames']).map(
          key => {
            ret = ret.concat(
              state.WaferflowListEntity['folderWithFlownames'][key]
            );
          }
        );
      } else {
        ret =
          state.WaferflowListEntity['folderWithFlownames'][selectedCollection];
      }
      return ret;
    }
  }
);
