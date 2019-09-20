import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

export interface ConfirmationDialogComponentData {
  title: string;
  message: string;
  confirmingLabel?: string;
  dismissiveLabel?: string;
}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  readonly title: string;
  readonly message: string;
  readonly confirmingLabel: string;
  readonly dismissiveLabel: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: ConfirmationDialogComponentData) {
    this.title = data.title;
    this.message = data.message;
    this.confirmingLabel = data.confirmingLabel || 'OK';
    this.dismissiveLabel = data.dismissiveLabel || 'Cancel';
  }

}
