import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaferflowlistViewComponent } from './waferflowlist-view.component';

describe('WaferflowlistViewComponent', () => {
  let component: WaferflowlistViewComponent;
  let fixture: ComponentFixture<WaferflowlistViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaferflowlistViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaferflowlistViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
