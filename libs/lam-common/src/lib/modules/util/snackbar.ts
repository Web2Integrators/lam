import { MatSnackBar } from '@angular/material';

// we show the snackbar for 4 seconds
export const SNACKBAR_DURATION = 4 * 1000;

/**
 * Convenience method for launching a snackbar. This function supports a message but no action.
 *
 * @param snackbar The service that launches a snackbar.
 * @param message The message to show in the snackbar.
 * @param duration The length of time in milliseconds to wait before automatically dismissing
 * the snack bar.
 */
export function openSnackbar(snackbar: MatSnackBar, message: string, duration = SNACKBAR_DURATION) {
  setTimeout(() => {
    snackbar.open(
      message,
      undefined,
      { duration }
    );
  });
}
