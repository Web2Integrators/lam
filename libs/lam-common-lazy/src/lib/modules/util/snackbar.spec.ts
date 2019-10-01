
import { fakeAsync, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SpyObject } from '@lamresearch/utility';
import { Duration, openSnackbar } from './snackbar';

describe('snackbar', () => {
  describe('openSnackbar', () => {
    //todo:removed type
    let snackbar: any;

    beforeEach(() => {
      snackbar = SpyObject.create(MatSnackBar);
    });

    it('should handle the defaults', fakeAsync(() => {
      openSnackbar(snackbar, 'foo');
      tick();

      expect(snackbar.open).toHaveBeenCalledTimes(1);
      expect(snackbar.open).toHaveBeenCalledWith('foo', undefined, { duration: Duration.Medium });
    }));

    it('should handle custom duration', fakeAsync(() => {
      openSnackbar(snackbar, 'bar', 56);
      tick();

      expect(snackbar.open).toHaveBeenCalledTimes(1);
      expect(snackbar.open).toHaveBeenCalledWith('bar', undefined, { duration: 56 });
    }));
  });
});
