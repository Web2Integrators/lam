import { CarsEntity } from './cars.models';
import { CarsState, carsAdapter, initialState } from './cars.reducer';
import * as CarsSelectors from './cars.selectors';

describe('Cars Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getCarsId = it => it['id'];
  const createCarsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as CarsEntity);

  let state;

  beforeEach(() => {
    state = {
      cars: carsAdapter.addAll(
        [
          createCarsEntity('PRODUCT-AAA'),
          createCarsEntity('PRODUCT-BBB'),
          createCarsEntity('PRODUCT-CCC')
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

  describe('Cars Selectors', () => {
    it('getAllCars() should return the list of Cars', () => {
      const results = CarsSelectors.getAllCars(state);
      const selId = getCarsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = CarsSelectors.getSelected(state);
      const selId = getCarsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getCarsLoaded() should return the current 'loaded' status", () => {
      const result = CarsSelectors.getCarsLoaded(state);

      expect(result).toBe(true);
    });

    it("getCarsError() should return the current 'error' state", () => {
      const result = CarsSelectors.getCarsError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
