import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface InputDialogComponentData {
  title: string;
  initialValue?: string;
  message: string;
}

@Component({
  selector: 'input-dialog',
  templateUrl: './input-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDialogComponent {
  readonly title: string;
  readonly message: string;
  readonly input: FormControl;

  constructor(@Inject(MAT_DIALOG_DATA) data: InputDialogComponentData) {
    // validate that there is at least one non-whitespace character
    this.input = new FormControl(data.initialValue, [
      Validators.required,
      Validators.pattern(/^.*\S.*$/),
    ]);
    this.message = data.message;
    this.title = data.title;
  }
}
