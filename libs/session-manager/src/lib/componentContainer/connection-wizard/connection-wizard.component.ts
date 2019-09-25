import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {  ConnectionService } from '../../services/connection.service';
import { WizardStep } from '../../types/types';

/**
 * Component to display a the steps necessary for setting up an authorized connection to the server.
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'connection-wizard',
  templateUrl: './connection-wizard.component.html',
  styleUrls: ['./connection-wizard.component.scss'],
})
export class ConnectionWizardComponent implements OnDestroy {
  private unsubscribe = new Subject<void>();
  step: Observable<WizardStep>;
  wizardStep = WizardStep;

  constructor(conn: ConnectionService, route: ActivatedRoute) {
    this.step = conn.wizardStep;

    // Capture query params on page load - no need to watch them:
    const address = route.snapshot.queryParams['address'];
    const resource = route.snapshot.queryParams['resource'];

    conn
      .initializeConnection(this.unsubscribe, address, resource)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(val=>console.log(val));
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
