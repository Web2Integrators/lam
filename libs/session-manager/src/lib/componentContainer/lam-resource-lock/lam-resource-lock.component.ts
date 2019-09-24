import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MachineResource } from '../../types/types';
import { ConnectionService } from '../../services/connection.service';



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lam-resource-lock',
  templateUrl: './lam-resource-lock.component.html',
  styleUrls: ['./lam-resource-lock.component.scss'],
})
export class LamResourceLockComponent {
  resources: Observable<MachineResource[]>;

  constructor(private conn: ConnectionService) {
    this.resources = conn.resourceList;
  }

  lockResource(resourceName: string) {
    this.conn.getResourceLock(resourceName); // "PMx"
  }
}
