import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutSidenavComponent } from './layoutContainers/layout-sidenav/layout-sidenav.component';

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild([
       {path: '', pathMatch: 'full', component: LayoutSidenavComponent}
    ])
  ],
  declarations: [LayoutSidenavComponent]
})
export class ExpressWaferFlowEditorModule {}
