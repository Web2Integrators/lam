import { CarsEntity } from './cars.models';
import * as CarsActions from './cars.actions';
import { CarsState, initialState, reducer } from './cars.reducer';

describe('Cars Reducer', () => {
  const createCarsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as CarsEntity);

  beforeEach(() => {});

  describe('valid Cars actions', () => {
    it('loadCarsSuccess should return set the list of known Cars', () => {
      const cars = [
        createCarsEntity('PRODUCT-AAA'),
        createCarsEntity('PRODUCT-zzz')
      ];
      const action = CarsActions.loadCarsSuccess({ cars });

      const result: CarsState = reducer(initialState, action);

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
