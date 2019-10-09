import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowlistviewComponent } from './flowlistview.component';

describe('FlowlistviewComponent', () => {
  let component: FlowlistviewComponent;
  let fixture: ComponentFixture<FlowlistviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowlistviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowlistviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
