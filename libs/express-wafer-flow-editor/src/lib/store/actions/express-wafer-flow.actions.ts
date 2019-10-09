import { createAction, props } from '@ngrx/store';

export const loadExpressWaferFlows = createAction(
  '[ExpressWaferFlow] Load ExpressWaferFlows'
);

export const loadExpressWaferFlowsSuccess = createAction(
  '[ExpressWaferFlow] Load ExpressWaferFlows Success',
  props<{ express: any }>()
);

export const loadExpressWaferFlowsFailure = createAction(
  '[ExpressWaferFlow] Load ExpressWaferFlows Failure',
  props<{ error: any }>()
);
