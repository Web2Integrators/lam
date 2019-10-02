import { async, TestBed } from '@angular/core/testing';
import { SessionManagerModule } from './session-manager.module';

xdescribe('SessionManagerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SessionManagerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SessionManagerModule).toBeDefined();
  });
});
