import { MatSnackBar } from '@angular/material/snack-bar';

// in milliseconds
export enum Duration {
  Short = 1500,
  Medium = 4000,
  Long = 10000,
}

/**
 * Convenience method for launching a snackbar. This function supports a message but no action.
 *
 * @param snackbar The service that launches a snackbar.
 * @param message The message to show in the snackbar.
 * @param duration The length of time in milliseconds to wait before automatically dismissing
 * the snack bar.
 */
export function openSnackbar(snackbar: MatSnackBar, message: string, duration = Duration.Medium) {
  setTimeout(() => {
    snackbar.open(message, undefined, { duration });
  });
}
