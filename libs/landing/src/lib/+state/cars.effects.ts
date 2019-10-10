import { Injectable } from '@angular/core';
import { createEffect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { CarsPartialState } from './cars.reducer';
import * as CarsActions from './cars.actions';

@Injectable()
export class CarsEffects {
  loadCars$ = createEffect(() =>
    this.dataPersistence.fetch(CarsActions.loadCars, {
      run: (
        action: ReturnType<typeof CarsActions.loadCars>,
        state: CarsPartialState
      ) => {
        // Your custom service 'load' logic goes here. For now just return a success action...
        return CarsActions.loadCarsSuccess({ cars: [] });
      },

      onError: (action: ReturnType<typeof CarsActions.loadCars>, error) => {
        console.error('Error', error);
        return CarsActions.loadCarsFailure({ error });
      }
    })
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<CarsPartialState>
  ) {}
}
