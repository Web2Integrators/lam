import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { FlowListEntity } from './flow-list.models';
import { FlowListEffects } from './flow-list.effects';
import { FlowListFacade } from './flow-list.facade';

import * as FlowListSelectors from './flow-list.selectors';
import * as FlowListActions from './flow-list.actions';
import {
  FLOWLIST_FEATURE_KEY,
  FlowListState,
  initialState,
  reducer
} from './flow-list.reducer';

interface TestSchema {
  flowList: FlowListState;
}

describe('FlowListFacade', () => {
  let facade: FlowListFacade;
  let store: Store<TestSchema>;
  const createFlowListEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as FlowListEntity);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(FLOWLIST_FEATURE_KEY, reducer),
          EffectsModule.forFeature([FlowListEffects])
        ],
        providers: [FlowListFacade]
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
      facade = TestBed.get(FlowListFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async done => {
      try {
        let list = await readFirst(facade.allFlowList$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.loadAll();

        list = await readFirst(facade.allFlowList$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadFlowListSuccess` to manually update list
     */
    it('allFlowList$ should return the loaded list; and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.allFlowList$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        store.dispatch(
          FlowListActions.loadFlowListSuccess({
            flowList: [createFlowListEntity('AAA'), createFlowListEntity('BBB')]
          })
        );

        list = await readFirst(facade.allFlowList$);
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
