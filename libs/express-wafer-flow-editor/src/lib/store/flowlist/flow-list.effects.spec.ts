import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { FlowListEffects } from './flow-list.effects';
import * as FlowListActions from './flow-list.actions';

describe('FlowListEffects', () => {
  let actions: Observable<any>;
  let effects: FlowListEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        FlowListEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.get(FlowListEffects);
  });

  describe('loadFlowList$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: FlowListActions.loadFlowList() });

      const expected = hot('-a-|', {
        a: FlowListActions.loadFlowListSuccess({ flowList: [] })
      });

      expect(effects.loadFlowList$).toBeObservable(expected);
    });
  });
});
