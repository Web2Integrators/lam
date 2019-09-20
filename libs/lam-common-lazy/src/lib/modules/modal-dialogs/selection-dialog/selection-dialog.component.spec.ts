import { SelectionDialogComponent } from './selection-dialog.component';

describe('SelectionDialogComponent', () => {
  let cmp: SelectionDialogComponent;

  beforeEach(() => {
    cmp = new SelectionDialogComponent({
      value: 'foo',
      title: '',
      options: [],
    });
  });

  describe('setValue', () => {
    it('should handle setting the value', () => {
      expect(cmp.selection.value).toBe('foo');
    });
  });
});
