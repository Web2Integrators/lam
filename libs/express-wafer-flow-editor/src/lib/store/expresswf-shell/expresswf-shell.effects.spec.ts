import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { ExpresswfShellEffects } from './expresswf-shell.effects';
import * as ExpresswfShellActions from './expresswf-shell.actions';

describe('ExpresswfShellEffects', () => {
  let actions: Observable<any>;
  let effects: ExpresswfShellEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        ExpresswfShellEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.get(ExpresswfShellEffects);
  });

  describe('loadExpresswfShell$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: ExpresswfShellActions.loadExpresswfShell() });

      const expected = hot('-a-|', {
        a: ExpresswfShellActions.loadExpresswfShellSuccess({
          expresswfShell: []
        })
      });

     // expect(effects.loadExpresswfShell$).toBeObservable(expected);
    });
  });
});
