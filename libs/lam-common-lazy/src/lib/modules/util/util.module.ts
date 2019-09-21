import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
//todo
// import { ColumnCustomHeaderComponent } from './ag-grid-custom-header/column-custom-header.component';
// import { ColumnGroupCustomHeaderComponent } from './ag-grid-custom-header/column-group-custom-header.component';
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
    MatProgressSpinnerModule,
  ],
  declarations: [
    AutofocusDirective,
    ProgressIndicatorComponent,
   // ColumnCustomHeaderComponent,
    //ColumnGroupCustomHeaderComponent,
    LamSelectComponent,
  ],
  entryComponents: [ProgressIndicatorComponent],
  exports: [
    AutofocusDirective,
    ProgressIndicatorComponent,
   // ColumnCustomHeaderComponent,
   // ColumnGroupCustomHeaderComponent,
    LamSelectComponent,
  ],
})
export class UtilModule {}
