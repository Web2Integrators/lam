import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { WaferflowListEntity } from './waferflow-list.models';
import { WaferflowListEffects } from './waferflow-list.effects';
import { WaferflowListFacade } from './waferflow-list.facade';

import * as WaferflowListSelectors from './waferflow-list.selectors';
import * as WaferflowListActions from './waferflow-list.actions';
import {
  WAFERFLOWLIST_FEATURE_KEY,
  WaferflowListState,
  initialState,
  reducer
} from './waferflow-list.reducer';

interface TestSchema {
  waferflowList: WaferflowListState;
}

describe('WaferflowListFacade', () => {
  let facade: WaferflowListFacade;
  let store: Store<TestSchema>;
  const createWaferflowListEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as WaferflowListEntity);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(WAFERFLOWLIST_FEATURE_KEY, reducer),
          EffectsModule.forFeature([WaferflowListEffects])
        ],
        providers: [WaferflowListFacade]
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
      facade = TestBed.get(WaferflowListFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async done => {
      try {
        let list = await readFirst(facade.allWaferflowList$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.loadAll();

        list = await readFirst(facade.allWaferflowList$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadWaferflowListSuccess` to manually update list
     */
    it('allWaferflowList$ should return the loaded list; and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.allWaferflowList$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        store.dispatch(
          WaferflowListActions.loadWaferflowListSuccess({
            waferflowList: [
              createWaferflowListEntity('AAA'),
              createWaferflowListEntity('BBB')
            ]
          })
        );

        list = await readFirst(facade.allWaferflowList$);
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
