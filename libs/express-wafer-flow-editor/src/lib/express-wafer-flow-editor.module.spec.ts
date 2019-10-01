import { async, TestBed } from '@angular/core/testing';
import { ExpressWaferFlowEditorModule } from './express-wafer-flow-editor.module';

describe('ExpressWaferFlowEditorModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ExpressWaferFlowEditorModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ExpressWaferFlowEditorModule).toBeDefined();
  });
});
