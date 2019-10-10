import { ExpresswfShellEntity } from './expresswf-shell.models';
import {
  ExpresswfShellState,
  expresswfShellAdapter,
  initialState
} from './expresswf-shell.reducer';
import * as ExpresswfShellSelectors from './expresswf-shell.selectors';

describe('ExpresswfShell Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getExpresswfShellId = it => it['id'];
  const createExpresswfShellEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as ExpresswfShellEntity);

  let state;

  beforeEach(() => {
    state = {
      expresswfShell: expresswfShellAdapter.addAll(
        [
          createExpresswfShellEntity('PRODUCT-AAA'),
          createExpresswfShellEntity('PRODUCT-BBB'),
          createExpresswfShellEntity('PRODUCT-CCC')
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true
        }
      )
    };
  });

  describe('ExpresswfShell Selectors', () => {
    it('getAllExpresswfShell() should return the list of ExpresswfShell', () => {
      const results = ExpresswfShellSelectors.getAllExpresswfShell(state);
      const selId = getExpresswfShellId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = ExpresswfShellSelectors.getSelected(state);
      const selId = getExpresswfShellId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getExpresswfShellLoaded() should return the current 'loaded' status", () => {
      const result = ExpresswfShellSelectors.getExpresswfShellLoaded(state);

      expect(result).toBe(true);
    });

    it("getExpresswfShellError() should return the current 'error' state", () => {
      const result = ExpresswfShellSelectors.getExpresswfShellError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
