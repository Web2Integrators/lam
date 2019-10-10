import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { ExpresswfShellEntity } from './expresswf-shell.models';
import { ExpresswfShellEffects } from './expresswf-shell.effects';
import { ExpresswfShellFacade } from './expresswf-shell.facade';

import * as ExpresswfShellSelectors from './expresswf-shell.selectors';
import * as ExpresswfShellActions from './expresswf-shell.actions';
import {
  EXPRESSWFSHELL_FEATURE_KEY,
  ExpresswfShellState,
  initialState,
  reducer
} from './expresswf-shell.reducer';

interface TestSchema {
  expresswfShell: ExpresswfShellState;
}

describe('ExpresswfShellFacade', () => {
  let facade: ExpresswfShellFacade;
  let store: Store<TestSchema>;
  const createExpresswfShellEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as ExpresswfShellEntity);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(EXPRESSWFSHELL_FEATURE_KEY, reducer),
          EffectsModule.forFeature([ExpresswfShellEffects])
        ],
        providers: [ExpresswfShellFacade]
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
      facade = TestBed.get(ExpresswfShellFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async done => {
      try {
        let list = await readFirst(facade.allExpresswfShell$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.loadAll();

        list = await readFirst(facade.allExpresswfShell$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadExpresswfShellSuccess` to manually update list
     */
    it('allExpresswfShell$ should return the loaded list; and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.allExpresswfShell$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        store.dispatch(
          ExpresswfShellActions.loadExpresswfShellSuccess({
            expresswfShell: [
              createExpresswfShellEntity('AAA'),
              createExpresswfShellEntity('BBB')
            ]
          })
        );

        list = await readFirst(facade.allExpresswfShell$);
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
