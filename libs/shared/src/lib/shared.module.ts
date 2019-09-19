import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route, Routes } from '@angular/router';
import { RootComponent } from './componentContainers/root/root.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@lamreseach/landing').then(
        m => m.LandingModule
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
