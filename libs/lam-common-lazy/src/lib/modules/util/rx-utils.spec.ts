import { FormBuilder, Validators } from '@angular/forms';
import { take, toArray } from 'rxjs/operators';
import { from } from 'rxjs';

import { toValueOfControl, startsWith, toValidityOfControl } from './rx-utils';

describe('RxJS utils', () => {
  it('toValueOfControl should send correct values thru the observable', async () => {
    const formBuilder = new FormBuilder();
    const group = formBuilder.group({ ctrl: ['a'] });
    setTimeout(() => group.patchValue({ ctrl: 'b' })); // Must happen after setting up the await
    const result = await toValueOfControl(group, 'ctrl')
      .pipe(
        take(2),
        toArray(),
      )
      .toPromise();
    expect(result).toEqual(['a', 'b']);
  });

  it('startsWith should be an operator that emits true when a prefixes matches', async () => {
    const source = from(['abc', 'bcd', 'cde', 'def']);
    const result = await source
      .pipe(
        startsWith(['ab', 'bc']),
        toArray(),
      )
      .toPromise();
    expect(result).toEqual([true, true, false, false]);
  });

  it('toValidityOfControl should send correct values thru the observable', async () => {
    const formBuilder = new FormBuilder();
    const group = formBuilder.group({ ctrl: ['', Validators.required] });
    setTimeout(() => group.patchValue({ ctrl: 'b' })); // Must happen after setting up the await
    const result = await toValidityOfControl(group, 'ctrl')
      .pipe(
        take(2),
        toArray(),
      )
      .toPromise();
    expect(result).toEqual([false, true]);
  });
});
