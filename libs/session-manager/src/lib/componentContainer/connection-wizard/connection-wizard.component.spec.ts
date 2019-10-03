//todo
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';


import { ConnectionWizardComponent } from './connection-wizard.component';
import { ConnectionService } from '../../services/connection.service';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { SpyObject } from '@lamresearch/utility';

describe('ConnectionWizardComponent', () => {
  let cmp: ConnectionWizardComponent;

 
  let connSvc: any;

  beforeEach(() => {
   

    connSvc = SpyObject.create(ConnectionService);
    connSvc.wizardStep = of('session');

    TestBed.configureTestingModule({
      providers: [
        ConnectionWizardComponent,
       
        { provide: ConnectionService, useValue: connSvc },
      ],
    });

    cmp = TestBed.get(ConnectionWizardComponent);
    connSvc = TestBed.get(ConnectionService);
  });

  it('should be created', () => {
    expect(cmp).toBeTruthy();
    cmp.step.subscribe(val => {
      expect(val).toEqual('session');
    }) 
   // expect(connSvc.initializeConnection).toHaveBeenCalledWith(jasmine.any(Observable), 'add', 'r');
  });
});
