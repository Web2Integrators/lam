import { FlowListEntity } from './flow-list.models';
import {
  FlowListState,
  flowListAdapter,
  initialState
} from './flow-list.reducer';
import * as FlowListSelectors from './flow-list.selectors';

describe('FlowList Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getFlowListId = it => it['id'];
  const createFlowListEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as FlowListEntity);

  let state;

  beforeEach(() => {
    state = {
      flowList: flowListAdapter.addAll(
        [
          createFlowListEntity('PRODUCT-AAA'),
          createFlowListEntity('PRODUCT-BBB'),
          createFlowListEntity('PRODUCT-CCC')
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

  describe('FlowList Selectors', () => {
    it('getAllFlowList() should return the list of FlowList', () => {
      const results = FlowListSelectors.getAllFlowList(state);
      const selId = getFlowListId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = FlowListSelectors.getSelected(state);
      const selId = getFlowListId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getFlowListLoaded() should return the current 'loaded' status", () => {
      const result = FlowListSelectors.getFlowListLoaded(state);

      expect(result).toBe(true);
    });

    it("getFlowListError() should return the current 'error' state", () => {
      const result = FlowListSelectors.getFlowListError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
