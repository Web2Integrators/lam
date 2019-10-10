import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { CarsEffects } from './cars.effects';
import * as CarsActions from './cars.actions';

describe('CarsEffects', () => {
  let actions: Observable<any>;
  let effects: CarsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        CarsEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.get(CarsEffects);
  });

  describe('loadCars$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: CarsActions.loadCars() });

      const expected = hot('-a-|', {
        a: CarsActions.loadCarsSuccess({ cars: [] })
      });

      expect(effects.loadCars$).toBeObservable(expected);
    });
  });
});
