import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  MatButtonModule,
  MatCardModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule
} from '@angular/material';
import { LayoutFullTopnavComponent } from './layoutContainers/layout-full-topnav/layout-full-topnav.component';
import { HomeComponent } from './componentContainers/home/home.component';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule
];
const routes: Routes = [
  {
    path: '',
    component: LayoutFullTopnavComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {path: 'home', component: HomeComponent}
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    MATERIAL_MODULES,
    RouterModule.forChild(routes)
  ],
  declarations: [LayoutFullTopnavComponent, HomeComponent]
})
export class LandingModule {}
