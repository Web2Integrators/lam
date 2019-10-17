import { NgModule } from '@angular/core';

import {
  MatSelectModule, MatCardModule,MatListModule,MatIconModule
} from '@angular/material';

@NgModule({
  imports: [
    MatCardModule,
    MatSelectModule,
    MatListModule,
    MatIconModule
  ],
  exports: [
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatListModule
  ],
})
export class MaterialModule {}
