import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { isString } from 'lodash';

export interface SelectOption<V = string> {
  display: string;
  value: V;
  class?: string;
  style?: Record<string, string>;
}

/**
 * Component to extend MatSelect to handle string[] or SelectOption[].
 */
@Component({
  selector: 'lam-select',
  template: `
    <mat-form-field appearance="standard">
      <mat-select [formControl]="selection" [placeholder]="placeholder">
        <mat-option
          *ngFor="let opt of options"
          [value]="getOptionValue(opt)"
          [ngClass]="getOptionClass(opt)"
          [ngStyle]="getOptionStyle(opt)"
          >{{ getOptionDisplay(opt) }}</mat-option
        >
      </mat-select>
    </mat-form-field>
  `,
  styleUrls: ['./lam-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LamSelectComponent<V = string> {
  @Input() options?: string[] | SelectOption<V>[];
  @Input() set value(value: V) {
    if (this.selection) {
      this.selection.patchValue(value);
    }
  }
  @Input() selection?: FormControl;
  @Input() placeholder?: string;

  /**
   * Obtain the true value of the selection. If the selection is a string, it's just that string.
   * If the selection is a SelectOption, it's the value property.
   */
  getOptionValue(opt: string | SelectOption<V>): string | V {
    return isString(opt) ? opt : opt.value;
  }

  /**
   * Obtain the display of the selection. If the selection is a string, it's just that string.
   * If the selection is a SelectOption, it's the display property.
   */
  getOptionDisplay(opt: string | SelectOption<V>): string {
    return isString(opt) ? opt : opt.display;
  }

  /**
   * Obtain the class of the selection. If the selection is a string, it's an empty string.
   * If the selection is a SelectOption, it's the class property.
   */
  getOptionClass(opt: string | SelectOption<V>): string | undefined {
    return isString(opt) ? '' : opt.class;
  }

  /**
   * Obtain styles to apply for the selection. If the selection is a string, it's undefined.
   * If the selection is a SelectOption, it's the style property.
   */
  getOptionStyle(opt: string | SelectOption<V>): Record<string, string> | undefined {
    return isString(opt) ? undefined : opt.style;
  }
}
