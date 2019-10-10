import { FlowListEntity } from './flow-list.models';
import * as FlowListActions from './flow-list.actions';
import { FlowListState, initialState, reducer } from './flow-list.reducer';

describe('FlowList Reducer', () => {
  const createFlowListEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as FlowListEntity);

  beforeEach(() => {});

  describe('valid FlowList actions', () => {
    it('loadFlowListSuccess should return set the list of known FlowList', () => {
      const flowList = [
        createFlowListEntity('PRODUCT-AAA'),
        createFlowListEntity('PRODUCT-zzz')
      ];
      const action = FlowListActions.loadFlowListSuccess({ flowList });

      const result: FlowListState = reducer(initialState, action);

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
