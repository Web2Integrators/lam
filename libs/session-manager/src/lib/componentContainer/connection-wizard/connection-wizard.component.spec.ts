//todo
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';


import { ConnectionWizardComponent } from './connection-wizard.component';
import { ConnectionService } from '../../services/connection.service';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { SpyObject } from '@lamresearch/utility';

xdescribe('ConnectionWizardComponent', () => {
  let cmp: ConnectionWizardComponent;

  let activatedRoute: ActivatedRoute;
  //todo:jasmine.SpyObj<ConnectionService> = > any
  let connSvc: any;

  beforeEach(() => {
    activatedRoute = SpyObject.create(ActivatedRoute);
    activatedRoute.snapshot = new ActivatedRouteSnapshot();
    activatedRoute.snapshot.queryParams = {
      address: 'add',
      resource: 'r',
    };

    connSvc = SpyObject.create(ConnectionService);
    connSvc.initializeConnection.and.returnValue(of(true));

    TestBed.configureTestingModule({
      providers: [
        ConnectionWizardComponent,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ConnectionService, useValue: connSvc },
      ],
    });

    cmp = TestBed.get(ConnectionWizardComponent);
    connSvc = TestBed.get(ConnectionService);
  });

  it('should be created', () => {
    expect(cmp).toBeTruthy();
    expect(connSvc.initializeConnection).toHaveBeenCalledWith(jasmine.any(Observable), 'add', 'r');
  });
});
