import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaferflowattributesComponent } from './waferflowattributes.component';

describe('WaferflowattributesComponent', () => {
  let component: WaferflowattributesComponent;
  let fixture: ComponentFixture<WaferflowattributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaferflowattributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaferflowattributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
