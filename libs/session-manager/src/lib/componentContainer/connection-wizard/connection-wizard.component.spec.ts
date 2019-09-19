import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionWizardComponent } from './connection-wizard.component';

describe('ConnectionWizardComponent', () => {
  let component: ConnectionWizardComponent;
  let fixture: ComponentFixture<ConnectionWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
