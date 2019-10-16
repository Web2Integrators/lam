import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { WaferflowListEffects } from './waferflow-list.effects';
import * as WaferflowListActions from './waferflow-list.actions';

describe('WaferflowListEffects', () => {
  let actions: Observable<any>;
  let effects: WaferflowListEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        WaferflowListEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.get(WaferflowListEffects);
  });

  describe('loadWaferflowList$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: WaferflowListActions.loadWaferflowList() });

      const expected = hot('-a-|', {
        a: WaferflowListActions.loadWaferflowListSuccess({ waferflowList: [] })
      });

      expect(effects.loadWaferflowList$).toBeObservable(expected);
    });
  });
});
