import { createAction, props } from '@ngrx/store';
import { Session } from '../../types/types';



export const sessionCreate = createAction(
  '[Session/API]Session Success',
  props<{ session: Session }>()
);

export const searchFailure = createAction(
  '[Books/API] Search Failure',
  props<{ errorMsg: string }>()
);

