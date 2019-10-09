import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ExpressWaferFlowEffects } from './express-wafer-flow.effects';

describe('ExpressWaferFlowEffects', () => {
  let actions$: Observable<any>;
  let effects: ExpressWaferFlowEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExpressWaferFlowEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<ExpressWaferFlowEffects>(ExpressWaferFlowEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
