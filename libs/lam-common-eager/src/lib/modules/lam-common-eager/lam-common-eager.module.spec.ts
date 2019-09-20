import { async, TestBed } from '@angular/core/testing';
import { LamCommonEagerModule } from './lam-common-eager.module';

describe('LamCommonEagerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LamCommonEagerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(LamCommonEagerModule).toBeDefined();
  });
});
