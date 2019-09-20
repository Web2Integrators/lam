import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Interface for extra data the component will need when launched from a generic context.
 */
export interface DetailsDialogComponentData {
  title: string;
  message: string;
  details?: any;
  yesNo: boolean;
}

/**
 * Component to display details in a collapsible folder.
 */
@Component({
  selector: 'details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsDialogComponent {
  readonly title: string;
  readonly message: string;
  readonly details: any;
  readonly yesNo: boolean;
  expandDetails: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) data: DetailsDialogComponentData) {
    this.title = data.title;
    this.message = data.message;
    this.details = data.details;
    this.yesNo = data.yesNo;
  }

  /**
   * Toggle the value of the expandDetails flag.
   */
  toggleDetails() {
    this.expandDetails = !this.expandDetails;
  }
}
