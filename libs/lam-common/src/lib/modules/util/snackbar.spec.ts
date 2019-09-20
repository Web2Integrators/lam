import { fakeAsync, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material';

import { SpyObject } from '../../../testing/spy-object.spec-util';
import { SNACKBAR_DURATION, openSnackbar } from './snackbar';

describe('snackbar', () => {
  describe('openSnackbar', () => {
    let snackbar: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
      snackbar = SpyObject.create(MatSnackBar);
    });

    it('should handle the defaults', fakeAsync(() => {
      openSnackbar(snackbar, 'foo');
      tick();

      expect(snackbar.open).toHaveBeenCalledTimes(1);
      expect(snackbar.open).toHaveBeenCalledWith('foo', undefined, { duration: SNACKBAR_DURATION });
    }));

    it('should handle custom duration', fakeAsync(() => {
      openSnackbar(snackbar, 'bar', 56);
      tick();

      expect(snackbar.open).toHaveBeenCalledTimes(1);
      expect(snackbar.open).toHaveBeenCalledWith('bar', undefined, { duration: 56 });
    }));
  });
});
