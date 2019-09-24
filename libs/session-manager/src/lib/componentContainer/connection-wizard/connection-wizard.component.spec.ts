//todo
// import { TestBed } from '@angular/core/testing';
// import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
// import { Observable, of } from 'rxjs';

// import { SpyObject } from '../../../testing/spy-object.spec-util';
// import { ConnectionService } from '../connection.service';
// import { ConnectionWizardComponent } from './connection-wizard.component';

// describe('ConnectionWizardComponent', () => {
//   let cmp: ConnectionWizardComponent;

//   let activatedRoute: ActivatedRoute;
//   let connSvc: jasmine.SpyObj<ConnectionService>;

//   beforeEach(() => {
//     activatedRoute = SpyObject.create(ActivatedRoute);
//     activatedRoute.snapshot = new ActivatedRouteSnapshot();
//     activatedRoute.snapshot.queryParams = {
//       address: 'add',
//       resource: 'r',
//     };

//     connSvc = SpyObject.create(ConnectionService);
//     connSvc.initializeConnection.and.returnValue(of(true));

//     TestBed.configureTestingModule({
//       providers: [
//         ConnectionWizardComponent,
//         { provide: ActivatedRoute, useValue: activatedRoute },
//         { provide: ConnectionService, useValue: connSvc },
//       ],
//     });

//     cmp = TestBed.get(ConnectionWizardComponent);
//     connSvc = TestBed.get(ConnectionService);
//   });

//   it('should be created', () => {
//     expect(cmp).toBeTruthy();
//     expect(connSvc.initializeConnection).toHaveBeenCalledWith(jasmine.any(Observable), 'add', 'r');
//   });
// });
