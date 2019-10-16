import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaferflowlistComponent } from './waferflowlist.component';

describe('WaferflowlistComponent', () => {
  let component: WaferflowlistComponent;
  let fixture: ComponentFixture<WaferflowlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaferflowlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaferflowlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
