import { async, TestBed } from '@angular/core/testing';
import { LamCommonLazyModule } from './lam-common-lazy.module';

describe('LamCommonLazyModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LamCommonLazyModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(LamCommonLazyModule).toBeDefined();
  });
});
