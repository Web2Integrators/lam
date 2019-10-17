import { createAction, props } from '@ngrx/store';
import { WaferflowListEntity } from './waferflow-list.models';

export const loadWaferflowList = createAction(
  '[WaferflowList] Load WaferflowList'
);

export const loadWaferflowListSuccess = createAction(
  '[WaferflowList] Load WaferflowList Success',
  props<{ waferflowList: WaferflowListEntity }>()
);

export const selectCollection = createAction(
  '[WaferflowList] Select Collection',
  props<{ collectionName: string }>()
);

export const loadWaferflowListFailure = createAction(
  '[WaferflowList] Load WaferflowList Failure',
  props<{ error: any }>()
);
