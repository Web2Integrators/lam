import { reducer } from './session.reducer';
import * as fromSession from './session.reducer';
import { Session } from '../../types/types';


describe('SessionsReducer', () => {
  const session: Session = {
    sessionID :'2'
  };

  const initialState: fromSession.State = {
    session: session
  };

  describe('undefined action', () => {
    it('should return the default state', () => {
      const result = reducer(undefined, {} as any);
      expect(result).toMatchSnapshot();
    });
  });

  describe('Selectors', () => {
    describe('selectId', () => {
      it('should return session', () => {
        const result = fromSession.getSession({...initialState});
        expect(result).toMatchSnapshot();
      });
    });
  });

});
