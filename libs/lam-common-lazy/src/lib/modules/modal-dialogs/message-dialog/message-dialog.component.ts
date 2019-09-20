import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface MessageDialogComponentData {
  title: string;
  messages: string[];
  closeButtonLabel?: string;
}

/**
 * Component to show a standard message dialog.
 */
@Component({
  selector: 'message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss'],
})
export class MessageDialogComponent {
  readonly title: string;
  readonly messages: string[];
  readonly closeButtonLabel: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: MessageDialogComponentData) {
    this.title = data.title;
    this.messages = data.messages;
    this.closeButtonLabel = data.closeButtonLabel || 'OK';
  }
}
