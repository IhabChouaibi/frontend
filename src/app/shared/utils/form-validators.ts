import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(startKey: string, endKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startValue = control.get(startKey)?.value;
    const endValue = control.get(endKey)?.value;

    if (!startValue || !endValue) {
      return null;
    }

    return new Date(endValue) >= new Date(startValue)
      ? null
      : { dateRange: true };
  };
}

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    return new Date(control.value) > new Date()
      ? null
      : { futureDate: true };
  };
}
