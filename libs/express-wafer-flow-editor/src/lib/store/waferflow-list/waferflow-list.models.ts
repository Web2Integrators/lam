import { Action } from '@ngrx/store';

/**
 * Interface for the 'WaferflowList' data
 */
export interface WaferflowListEntity {
  data?: any;
}

export interface Facade {
  dispatch(action: Action);
}
