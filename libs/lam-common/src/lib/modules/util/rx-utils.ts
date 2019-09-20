import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { isEqual } from 'lodash';
import { Observable, OperatorFunction, defer, empty, of, merge } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';

/**
 * Convenience RxJS operator that applies a !!foo filter and modifies the downstream type
 * appropriately.
 */
export function exists<T>(): OperatorFunction<T | undefined | null, T> {
  return filter((value: T | undefined | null): value is T => !!value);
}

/**
 * Get an observable for the latest value of a control including its initial value.
 *
 * @param source The AbstractControl itself or its ancestor in the hierarchy.
 * @param path If included, the path from source to the control. If not included, then source is
 * used directly.
 */
export function toValueOfControl<T>(
  source: AbstractControl,
  path?: string | (string | number)[],
): Observable<T> {
  const control = path ? source.get(path) : source;
  if (!control) {
    return empty();
  }
  // startWith evaluates immediately, but we need to get the value of the control at subscription
  // time. Deferring allows us to get the updated value.
  return merge(control.valueChanges, defer(() => of(control.value))).pipe(
    distinctUntilChanged(isEqual),
    shareReplay(1),
  );
}

/**
 * Get an observable for the latest raw value of a control including its initial raw value.
 *
 * @param source The AbstractControl itself or its ancestor in the hierarchy.
 * @param path If included, the path from source to the control. If not included, then source is
 * used directly.
 */
export function toRawValueOfControl<T>(
  source: AbstractControl,
  path?: string | (string | number)[],
): Observable<T> {
  const control = path ? source.get(path) : source;
  if (!control) {
    return empty();
  }
  if (isFormGroup(control) || isFormArray(control)) {
    // startWith evaluates immediately, but we need to get the value of the control at
    // subscription time. Deferring allows us to get the updated value.
    return merge(control.valueChanges, defer(() => of(control.getRawValue()))).pipe(
      // get the raw value that contains all of the children, even the disabled ones
      map(_value => control.getRawValue()),
      distinctUntilChanged(isEqual),
      shareReplay(1),
    );
  } else {
    // a FormControl doesn't distinguish between value and rawValue, so just use the other function.
    return toValueOfControl(control);
  }
}

/**
 * An RxJS operator that emits true if the source string starts with any of the given prefixes.
 * @param prefixes Array of string prefixes.
 */
export function startsWith(prefixes: string[]) {
  return map<string, boolean>(type => prefixes.some(pre => type.startsWith(pre)));
}

function isFormGroup(control: AbstractControl): control is FormGroup {
  return control instanceof FormGroup;
}

function isFormArray(control: AbstractControl): control is FormArray {
  return control instanceof FormArray;
}
