import { createAction, props } from '@ngrx/store';
import { FlowListEntity } from './flow-list.models';

export const loadFlowList = createAction('[FlowList] Load FlowList');

export const loadFlowListSuccess = createAction(
  '[FlowList] Load FlowList Success',
  props<{ flowlist: any }>()
);

export const loadFlowListFailure = createAction(
  '[FlowList] Load FlowList Failure',
  props<{ error: any }>()
);
