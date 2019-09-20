import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

import { SelectOption } from '../../util/select/lam-select.component';

export interface SelectionDialogComponentData<V = string> {
  title: string;
  options: string[] | SelectOption<V>[];
  value: V;
}

/**
 * Component to create a dialog that allows the user to select an option from a select list.
 * The list is populated from either an array of strings or an array of SelectOption objects.
 */
@Component({
  selector: 'selection-dialog',
  templateUrl: './selection-dialog.component.html',
  styleUrls: ['./selection-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionDialogComponent<V = string> {
  readonly title: string;
  readonly options: string[] | SelectOption<V>[];
  readonly selection: FormControl;

  constructor(@Inject(MAT_DIALOG_DATA) data: SelectionDialogComponentData<V>) {
    this.title = data.title;
    this.options = data.options;
    this.selection = new FormControl(data.value, Validators.required);
  }
}
