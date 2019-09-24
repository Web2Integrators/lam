import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';

import { SelectOption } from '../util/select/lam-select.component';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogComponentData,
} from './confirmation-dialog/confirmation-dialog.component';
import {
  DetailsDialogComponent,
  DetailsDialogComponentData,
} from './details-dialog/details-dialog.component';
import {
  InputDialogComponent,
  InputDialogComponentData,
} from './input-dialog/input-dialog.component';
import {
  MessageDialogComponent,
  MessageDialogComponentData,
} from './message-dialog/message-dialog.component';
import { ModalModule } from './modal.module';
import {
  SelectionDialogComponent,
  SelectionDialogComponentData,
} from './selection-dialog/selection-dialog.component';

@Injectable({ providedIn: 'root' }) // can't use root: entryComponents don't work that way
export class ModalService {
  constructor(private modal: MatDialog) {}

  /**
   * Closes all of the currently-open dialogs.
   */
  closeAll() {
    this.modal.closeAll();
  }

  /**
   * Open a dialog that allows the user to select an option from a list of specified options.
   *
   * @param options The list of options to display for the user
   * @param value The previous selection
   * @param title The title for the dialog
   */
  select<V = string>(
    options: string[] | SelectOption<V>[],
    value: V,
    title: string,
  ): Observable<V> {
    return this.custom<SelectionDialogComponent, SelectionDialogComponentData<V>, V>(
      SelectionDialogComponent,
      { title, options, value },
    ).pipe(filter(result => !!result)); // pass value only if a selection was made
  }

  /**
   * Open a dialog that allows the user to confirm a question.
   *
   * @param message The body of the dialog
   * @param title The title for the dialog
   */
  confirm(
    message = 'Are you sure?',
    title = 'Confirm',
    confirmingLabel = 'OK',
    dismissiveLabel = 'Cancel',
  ): Observable<boolean> {
    return this.custom<ConfirmationDialogComponent, ConfirmationDialogComponentData, boolean>(
      ConfirmationDialogComponent,
      { title, message, confirmingLabel, dismissiveLabel },
    );
  }

  /**
   * Open a dialog that gives the user a message (or messages).
   *
   * @param message The body of the dialog
   * @param title The title for the dialog
   * @param closeButtonLabel The text to show for the single button
   */
  message(
    message: string | string[],
    title = 'Message',
    closeButtonLabel = 'OK',
  ): Observable<boolean> {
    const messages = Array.isArray(message) ? message : [message];
    return this.custom<MessageDialogComponent, MessageDialogComponentData, boolean>(
      MessageDialogComponent,
      { title, messages, closeButtonLabel },
    );
  }

  /**
   * Open a dialog that gives the user a message. Returns the raw modal object.
   *
   * @param message The body of the dialog
   * @param title The title for the dialog. Defaults to 'Message'.
   */
  rawMessage(
    message: string,
    title = 'Message',
    closeButtonLabel = 'OK',
  ): MatDialogRef<MessageDialogComponent, void> {
    const data: MessageDialogComponentData = { title, messages: [message], closeButtonLabel };
    return this.modal.open<MessageDialogComponent, MessageDialogComponentData, void>(
      MessageDialogComponent,
      { hasBackdrop: true, disableClose: true, data },
    );
  }

  /**
   * Open a dialog that gives the user a message and details.
   *
   * @param message The body of the dialog
   * @param title The title for the dialog
   * @param details Details to optionally show
   */
  details(
    message: string,
    details?: any,
    title = 'Message',
    yesNo: boolean = false,
  ): Observable<boolean> {
    return this.custom<DetailsDialogComponent, DetailsDialogComponentData, boolean>(
      DetailsDialogComponent,
      { title, message, details, yesNo },
    );
  }

  /**
   * Open a dialog that prompts the user for a string value.
   *
   * @param message The body of the dialog
   * @param title The title for the dialog
   * @param initialValue The initial value of the input field
   */
  input(message: string, title = 'Input', initialValue?: string): Observable<string> {
    return this.custom<InputDialogComponent, InputDialogComponentData, string>(
      InputDialogComponent,
      { title, initialValue, message },
    );
  }

  /**
   * Open a dialog with a custom component.
   *
   * @param content the type of the component to use for the dialog
   * @param config properties to set on the component
   */
  custom<T, D, R>(content: Type<T>, data?: D, minWidth?: string): Observable<R> {
    const modal = this.modal.open<T, D>(content, {
      hasBackdrop: true,
      disableClose: true,
      data,
      minWidth,
    });

    // Handle promise rejection from Esc key:
    return modal.afterClosed().pipe(catchError(_ => of(undefined)));
  }
}
