import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeattributesComponent } from './nodeattributes.component';

describe('NodeattributesComponent', () => {
  let component: NodeattributesComponent;
  let fixture: ComponentFixture<NodeattributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeattributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeattributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
