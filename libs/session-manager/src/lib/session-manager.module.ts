import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConnectionWizardComponent } from './componentContainer/connection-wizard/connection-wizard.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
       {path: '', pathMatch: 'full', component: ConnectionWizardComponent}
    ])
  ],
  declarations: [ConnectionWizardComponent]
})
export class SessionManagerModule {}
