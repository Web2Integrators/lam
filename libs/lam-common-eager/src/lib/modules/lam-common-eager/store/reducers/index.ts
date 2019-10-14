import {
  Action,
  ActionReducerMap,
} from '@ngrx/store';

import * as fromRouter from '@ngrx/router-store';
import { InjectionToken } from '@angular/core';

export interface AppState {
  router: fromRouter.RouterReducerState<any>;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<AppState, Action>>('Root reducers token', {
  factory: () => ({
    router: fromRouter.routerReducer,
  }),
});




