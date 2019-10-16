import { WaferflowListEntity } from './waferflow-list.models';
import * as WaferflowListActions from './waferflow-list.actions';
import {
  WaferflowListState,
  initialState,
  reducer
} from './waferflow-list.reducer';

describe('WaferflowList Reducer', () => {
  const createWaferflowListEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as WaferflowListEntity);

  beforeEach(() => {});

  describe('valid WaferflowList actions', () => {
    it('loadWaferflowListSuccess should return set the list of known WaferflowList', () => {
      const waferflowList = [
        createWaferflowListEntity('PRODUCT-AAA'),
        createWaferflowListEntity('PRODUCT-zzz')
      ];
      const action = WaferflowListActions.loadWaferflowListSuccess({
        waferflowList
      });

      const result: WaferflowListState = reducer(initialState, action);

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
