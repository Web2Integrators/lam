import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { CarsEntity } from './cars.models';
import { CarsEffects } from './cars.effects';
import { CarsFacade } from './cars.facade';

import * as CarsSelectors from './cars.selectors';
import * as CarsActions from './cars.actions';
import {
  CARS_FEATURE_KEY,
  CarsState,
  initialState,
  reducer
} from './cars.reducer';

interface TestSchema {
  cars: CarsState;
}

describe('CarsFacade', () => {
  let facade: CarsFacade;
  let store: Store<TestSchema>;
  const createCarsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as CarsEntity);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(CARS_FEATURE_KEY, reducer),
          EffectsModule.forFeature([CarsEffects])
        ],
        providers: [CarsFacade]
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          NxModule.forRoot(),
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule
        ]
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.get(Store);
      facade = TestBed.get(CarsFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async done => {
      try {
        let list = await readFirst(facade.allCars$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.loadAll();

        list = await readFirst(facade.allCars$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadCarsSuccess` to manually update list
     */
    it('allCars$ should return the loaded list; and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.allCars$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        store.dispatch(
          CarsActions.loadCarsSuccess({
            cars: [createCarsEntity('AAA'), createCarsEntity('BBB')]
          })
        );

        list = await readFirst(facade.allCars$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(2);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });
  });
});
