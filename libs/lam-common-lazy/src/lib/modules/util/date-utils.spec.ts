//todo
import * as moment from 'moment';

import { parsePdeDate } from './date-utils';

describe('Date Utils', () => {
  describe('parsePdeDate', () => {
    describe('verbose format', () => {
      it('should handle full', () => {
        const result = parsePdeDate('March 15, 2018   11:12:36 am   431 Milliseconds ');

        expect(result).toEqual(moment('2018-03-15 11:12:36').toDate());
      });

      it('should handle full (Jan)', () => {
        const result = parsePdeDate('January 8, 2018   2:21:19 pm   507 Milliseconds ');

        expect(result).toEqual(moment('2018-01-08 14:21:19').toDate());
      });

      it('should handle full (Dec)', () => {
        const result = parsePdeDate('December 8, 2018   2:21:19 pm   507 Milliseconds ');

        expect(result).toEqual(moment('2018-12-08 14:21:19').toDate());
      });

      it('should handle unknown month', () => {
        const result = parsePdeDate('Foo 15, 2018   11:12:36 am   431 Milliseconds ');

        expect(result).toBeUndefined();
      });

      it('should handle day out of range', () => {
        const result = parsePdeDate('March 45, 2018   11:12:36 am   431 Milliseconds ');

        expect(result).toBeUndefined();
      });

      it('should handle hours out of range', () => {
        const result = parsePdeDate('March 15, 2018   13:12:36 am   431 Milliseconds ');

        expect(result).toBeUndefined();
      });

      it('should handle minutes out of range', () => {
        const result = parsePdeDate('March 15, 2018   11:62:36 am   431 Milliseconds ');

        expect(result).toBeUndefined();
      });

      it('should handle seconds out of range', () => {
        const result = parsePdeDate('March 15, 2018   11:12:66 am   431 Milliseconds ');

        expect(result).toBeUndefined();
      });

      it('should handle a month name', () => {
        const result = parsePdeDate('May');

        expect(result).toBeUndefined();
      });

      it('should handle slim', () => {
        const result = parsePdeDate('May 1, 2018   1:06:00 pm   495 Milliseconds ');

        expect(result).toEqual(moment('2018-05-01 13:06:00').toDate());
      });
    });

    describe('slim format', () => {
      it('should handle full', () => {
        const result = parsePdeDate('12/20/2017  20:38:17');

        expect(result).toEqual(moment('2017-12-20 20:38:17').toDate());
      });

      it('should handle month out of range', () => {
        const result = parsePdeDate('13/20/2017  20:38:17');

        expect(result).toBeUndefined();
      });

      it('should handle day out of range', () => {
        const result = parsePdeDate('12/40/2017  20:38:17');

        expect(result).toBeUndefined();
      });

      it('should handle hours out of range', () => {
        const result = parsePdeDate('12/20/2017  30:38:17');

        expect(result).toBeUndefined();
      });

      it('should handle minutes out of range', () => {
        const result = parsePdeDate('12/20/2017  20:68:17');

        expect(result).toBeUndefined();
      });

      it('should handle seconds out of range', () => {
        const result = parsePdeDate('12/20/2017  20:38:67');

        expect(result).toBeUndefined();
      });

      it('should handle narrow', () => {
        const result = parsePdeDate('7/7/2017  8:8:7');

        expect(result).toEqual(moment('2017-07-07 08:08:07').toDate());
      });
    });

    it('should handle unexpected format', () => {
      const result = parsePdeDate('Jul 4, 1776 16:20:20 123 Milliseconds');

      expect(result).toBeUndefined();
    });
  });
});
