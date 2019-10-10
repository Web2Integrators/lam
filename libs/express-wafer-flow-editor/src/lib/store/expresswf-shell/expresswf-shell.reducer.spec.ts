import { ExpresswfShellEntity } from './expresswf-shell.models';
import * as ExpresswfShellActions from './expresswf-shell.actions';
import {
  ExpresswfShellState,
  initialState,
  reducer
} from './expresswf-shell.reducer';

describe('ExpresswfShell Reducer', () => {
  const createExpresswfShellEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as ExpresswfShellEntity);

  beforeEach(() => {});

  describe('valid ExpresswfShell actions', () => {
    it('loadExpresswfShellSuccess should return set the list of known ExpresswfShell', () => {
      const expresswfShell = [
        createExpresswfShellEntity('PRODUCT-AAA'),
        createExpresswfShellEntity('PRODUCT-zzz')
      ];
      const action = ExpresswfShellActions.loadExpresswfShellSuccess({
        expresswfShell
      });

      const result: ExpresswfShellState = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
