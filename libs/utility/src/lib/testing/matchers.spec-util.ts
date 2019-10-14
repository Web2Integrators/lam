// import CustomMatcherResult = jasmine.CustomMatcherResult;
// import CustomMatcher = jasmine.CustomMatcher;
// import CustomEqualityTester = jasmine.CustomEqualityTester;
// import MatchersUtil = jasmine.MatchersUtil;
import { SpyObject } from './spy-object.spec-util';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { LogService, Logger } from '@lamresearch/lam-common-eager';






export const logSvc: any = SpyObject.create(LogService);
export const logSpy: any = SpyObject.create(Logger);
//logSvc.createLogger.and.returnValue(logSpy);

// import { isFunction } from 'lodash';

// function negate(pass: boolean): string {
//   return pass ? ' not ' : ' ';
// }

// export const customMatchers = {
//   toBeFunction: (
//     _util: MatchersUtil,
//     _customEqualityTesters: Array<CustomEqualityTester>,
//   ): CustomMatcher => {
//     return {
//       compare: function(actual: any): CustomMatcherResult {
//         const result: jasmine.CustomMatcherResult = { pass: isFunction(actual) };
//         result.message = 'Expected' + negate(result.pass) + 'to be a function.';
//         return result;
//       },
//     };
//   },
// };
