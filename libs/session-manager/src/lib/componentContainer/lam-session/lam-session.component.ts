import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConnectionService } from '../../services/connection.service';




const toolId = new FormControl('');

/**
 * Component to display the initial backend-connection dialog.
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lam-session',
  templateUrl: './lam-session.component.html',
  styleUrls: ['./lam-session.component.scss'],
})
export class LamSessionComponent {
  toolId = toolId;
  sessionError: Observable<boolean>;

  constructor( private conn: ConnectionService) {
    this.sessionError = conn.sessionError;
    //todo
    // this.store
    //   .pipe(
    //     select(getConfig),
    //     filter(config => !!config),
    //     take(1),
    //   )
    //   .subscribe(config => {
    //     if (this.toolId.value === '') {
    //       this.toolId.setValue(config!.defaultToolAddress);
    //     }
    //   });
  }

  openSession() {
    this.conn.openSession(this.toolId.value);
  }
}
