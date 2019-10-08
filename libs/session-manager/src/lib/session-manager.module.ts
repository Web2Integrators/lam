import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConnectionWizardComponent } from './componentContainer/connection-wizard/connection-wizard.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatFormFieldModule,
  MatCardModule,
  MatButtonModule
} from '@angular/material';
import { LamSessionComponent } from './componentContainer/lam-session/lam-session.component';
import { LamLoginComponent } from './componentContainer/lam-login/lam-login.component';
import { LamResourceLockComponent } from './componentContainer/lam-resource-lock/lam-resource-lock.component';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { ModalModule } from '@lamresearch/lam-common-lazy';
import { StoreModule } from '@ngrx/store';
import * as fromSession from './store/reducers';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    StoreModule.forFeature(fromSession.sessionFeatureKey, fromSession.reducers),
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ConnectionWizardComponent }
    ])
  ],
  declarations: [
    ConnectionWizardComponent,
    LamSessionComponent,
    LamLoginComponent,
    LamResourceLockComponent
  ]
})
export class SessionManagerModule {}
