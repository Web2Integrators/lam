import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConnectionService } from '../../services/connection.service';



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lam-login',
  templateUrl: './lam-login.component.html',
  styleUrls: ['./lam-login.component.scss'],
})
export class LamLoginComponent {
  loginForm: FormGroup;
  loginFailure: Observable<boolean>;
  toolId: string | undefined;
  connected: Observable<boolean>;

  constructor(fb: FormBuilder, private conn: ConnectionService) {
    this.loginForm = fb.group({
      username: ['system'],
      password: ['system'],
    });

    this.toolId = conn.session && conn.session.toolID;
    this.loginFailure = conn.loginError;

    this.connected = conn.hasBackendConfig;
  }

  login() {
    this.conn.login(this.loginForm.value);
  }

  closeSession() {
    this.conn.closeSession();
  }
}
