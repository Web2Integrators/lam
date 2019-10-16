import {  createSelector } from '@ngrx/store';
import { selectExpresseWaferFlowState, ExpresseWaferFlowType } from '../index';
import { WaferflowListState } from './waferflow-list.reducer';

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
