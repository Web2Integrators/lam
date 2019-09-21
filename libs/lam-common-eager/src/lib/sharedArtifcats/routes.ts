import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'landing',
    loadChildren: () =>
      import('@lamresearch/landing').then(
        m => m.LandingModule
      )
  },
  {
    path: '',
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
