import { LamSelectComponent, SelectOption } from './lam-select.component';

describe('LamSelectComponent', () => {
  let cmp: LamSelectComponent;

  beforeEach(() => {
    cmp = new LamSelectComponent();
  });

  describe('getOption function', () => {
    describe('with string', () => {
      let opt: string;
      beforeEach(() => {
        opt = 'foo';
      });

      describe('getOptionValue', () => {
        it('should return the value', () => {
          expect(cmp.getOptionValue(opt)).toBe('foo');
        });
      });

      describe('getOptionDisplay', () => {
        it('should return the display', () => {
          expect(cmp.getOptionDisplay(opt)).toBe('foo');
        });
      });

      describe('getOptionClass', () => {
        it('should return the class', () => {
          expect(cmp.getOptionClass(opt)).toBe('');
        });
      });

      describe('getOptionStyle', () => {
        it('should return the stype', () => {
          expect(cmp.getOptionStyle(opt)).toBeUndefined();
        });
      });
    });

    describe('with SelectOption', () => {
      let opt: SelectOption<string>;
      beforeEach(() => {
        opt = {
          display: 'd',
          value: 'v',
          class: 'c',
          style: { foo: 'bar' },
        };
      });

      describe('getOptionValue', () => {
        it('should return the value', () => {
          expect(cmp.getOptionValue(opt)).toBe('v');
        });
      });

      describe('getOptionDisplay', () => {
        it('should return the display', () => {
          expect(cmp.getOptionDisplay(opt)).toBe('d');
        });
      });

      describe('getOptionClass', () => {
        it('should return the class', () => {
          expect(cmp.getOptionClass(opt)).toBe('c');
        });
      });

      describe('getOptionStyle', () => {
        it('should return the stype', () => {
          expect(cmp.getOptionStyle(opt)).toEqual({ foo: 'bar' });
        });
      });
    });
  });

});
