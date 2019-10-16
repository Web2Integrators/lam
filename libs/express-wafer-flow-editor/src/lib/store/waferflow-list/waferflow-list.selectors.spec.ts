import { WaferflowListEntity } from './waferflow-list.models';
import {
  WaferflowListState,
  waferflowListAdapter,
  initialState
} from './waferflow-list.reducer';
import * as WaferflowListSelectors from './waferflow-list.selectors';

describe('WaferflowList Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getWaferflowListId = it => it['id'];
  const createWaferflowListEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as WaferflowListEntity);

  let state;

  beforeEach(() => {
    state = {
      waferflowList: waferflowListAdapter.addAll(
        [
          createWaferflowListEntity('PRODUCT-AAA'),
          createWaferflowListEntity('PRODUCT-BBB'),
          createWaferflowListEntity('PRODUCT-CCC')
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

  describe('WaferflowList Selectors', () => {
    it('getAllWaferflowList() should return the list of WaferflowList', () => {
      const results = WaferflowListSelectors.getAllWaferflowList(state);
      const selId = getWaferflowListId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = WaferflowListSelectors.getSelected(state);
      const selId = getWaferflowListId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getWaferflowListLoaded() should return the current 'loaded' status", () => {
      const result = WaferflowListSelectors.getWaferflowListLoaded(state);

      expect(result).toBe(true);
    });

    it("getWaferflowListError() should return the current 'error' state", () => {
      const result = WaferflowListSelectors.getWaferflowListError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
