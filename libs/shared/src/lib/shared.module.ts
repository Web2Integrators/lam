import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route, Routes } from '@angular/router';
import { RootComponent } from './componentContainers/root/root.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@lamresearch/landing').then(
        m => m.LandingModule
      )
  },
  {
    path: 'session',
    loadChildren: () =>
      import("@lamresearch/session-manager").then(
        m => m.SessionManagerModule
      )
  },
  // {
  //   path: 'dashboard',
  //   loadChildren: () =>
  //     import('@lam/dashboard').then(
  //       m => m.DashboardModule
  //     )
  // }
];

@NgModule({
  imports: [CommonModule,RouterModule],
  declarations: [RootComponent],
  exports: [RootComponent]
})
export class SharedModule {}
