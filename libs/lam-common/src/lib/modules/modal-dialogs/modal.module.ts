import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';

import { UtilModule } from '../util/util.module';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DetailsDialogComponent } from './details-dialog/details-dialog.component';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { SelectionDialogComponent } from './selection-dialog/selection-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    UtilModule,
  ],
  exports: [
    MatButtonModule,
    MatDialogModule,
  ],
  declarations: [
    ConfirmationDialogComponent,
    DetailsDialogComponent,
    InputDialogComponent,
    MessageDialogComponent,
    SelectionDialogComponent,
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    DetailsDialogComponent,
    InputDialogComponent,
    MessageDialogComponent,
    SelectionDialogComponent,
  ],
})
export class ModalModule { }
