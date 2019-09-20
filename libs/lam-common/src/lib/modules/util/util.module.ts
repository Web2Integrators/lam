import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDividerModule,
  MatFormFieldModule,
  MatSelectModule
} from '@angular/material';

// import {
//   ColumnCustomHeaderComponent
// } from './ag-grid-custom-header/column-custom-header.component';
// import {
//   ColumnGroupCustomHeaderComponent
// } from './ag-grid-custom-header/column-group-custom-header.component';
import { AutofocusDirective } from './autofocus/autofocus.directive';
import { ProgressIndicatorComponent } from './progress-indicator/progress-indicator.component';
import { LamSelectComponent } from './select/lam-select.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  declarations: [
    AutofocusDirective,
    ProgressIndicatorComponent,
   // ColumnCustomHeaderComponent,
  //  ColumnGroupCustomHeaderComponent,
    LamSelectComponent,
  ],
  exports: [
    AutofocusDirective,
    ProgressIndicatorComponent,
   // ColumnCustomHeaderComponent,
   // ColumnGroupCustomHeaderComponent,
    LamSelectComponent,
  ]
})
export class UtilModule {

}
