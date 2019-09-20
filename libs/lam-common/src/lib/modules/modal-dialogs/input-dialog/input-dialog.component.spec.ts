import { InputDialogComponent } from './input-dialog.component';

describe('InputDialogComponent', () => {
  let component: InputDialogComponent;
  function conjureData(initialValue?: string) {
    return {
      title: 't',
      initialValue,
      message: 'm'
    };
  }

  describe('input', () => {
    it('should handle a simple input', () => {
      component = new InputDialogComponent(conjureData('4'));
      expect(component.input.valid).toBe(true);
    });

    it('should handle an empty input', () => {
      component = new InputDialogComponent(conjureData(''));
      expect(component.input.valid).toBe(false);
    });

    it('should handle a blank input', () => {
      component = new InputDialogComponent(conjureData('  '));
      expect(component.input.valid).toBe(false);
    });

    it('should handle a legal input that needs trimming', () => {
      component = new InputDialogComponent(conjureData('  sdk  '));
      expect(component.input.valid).toBe(true);
    });

    it('should handle a legal input with internal whitespace', () => {
      component = new InputDialogComponent(conjureData('  sdk d '));
      expect(component.input.valid).toBe(true);
    });
  });

});
