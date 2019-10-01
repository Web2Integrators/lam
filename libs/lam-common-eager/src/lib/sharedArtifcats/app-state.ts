import {
  Action,
  ActionReducerMap,
  createAction,
  createSelector,
  createReducer,
  on,
} from '@ngrx/store';
import { InjectionToken } from '@angular/core';

export interface AppState {
  pendingRequestCount: number;
}

export const incrementPendingRequests = createAction('[LAM] INCREMENT_PENDING_REQUESTS');
export const decrementPendingRequests = createAction('[LAM] DECREMENT_PENDING_REQUESTS');

const selectState = (state: AppState) => state;
export const hasPendingRequests = createSelector(
  selectState,
  s => s.pendingRequestCount > 0,
);

export const pendingRequestCountReducer = createReducer(
  0,
  on(incrementPendingRequests, pendingRequestCount => pendingRequestCount + 1),
  on(decrementPendingRequests, pendingRequestCount => pendingRequestCount - 1),
);

// Register your reducers with NgRx framework in an AOT-compatible way
export const reducers = new InjectionToken<ActionReducerMap<AppState, Action>>(
  'Root reducers token',
  {
    factory: () => ({
      pendingRequestCount: pendingRequestCountReducer,
    }),
  },
);
