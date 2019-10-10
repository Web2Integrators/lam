import { createAction, props } from '@ngrx/store';
import { CarsEntity } from './cars.models';

export const loadCars = createAction('[Cars] Load Cars');

export const loadCarsSuccess = createAction(
  '[Cars] Load Cars Success',
  props<{ cars: CarsEntity[] }>()
);

export const loadCarsFailure = createAction(
  '[Cars] Load Cars Failure',
  props<{ error: any }>()
);
