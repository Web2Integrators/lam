import { Action } from '@ngrx/store';
/**
 * Interface for the 'FlowList' data
 */
export interface FlowListEntity {
  id: string | number; // Primary ID
}

export interface Facade {
  dispatch(action:Action);
}
