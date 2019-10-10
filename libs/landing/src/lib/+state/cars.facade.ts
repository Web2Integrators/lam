import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromCars from './cars.reducer';
import * as CarsSelectors from './cars.selectors';
import * as CarsActions from './cars.actions';

@Injectable()
export class CarsFacade {
  loaded$ = this.store.pipe(select(CarsSelectors.getCarsLoaded));
  allCars$ = this.store.pipe(select(CarsSelectors.getAllCars));
  selectedCars$ = this.store.pipe(select(CarsSelectors.getSelected));

  constructor(private store: Store<fromCars.CarsPartialState>) {}

  loadAll() {
    this.store.dispatch(CarsActions.loadCars());
  }
}
