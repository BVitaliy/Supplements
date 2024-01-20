import { FormGroup } from '@angular/forms';
import { ValidatorFn, AbstractControl } from '@angular/forms';

// eslint-disable-next-line max-len
// export const passwordPattern = '(?=^.{6,}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*';

export function ConfirmedValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

export function matchFieldsValidator(controlName1: string, controlName2: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
      const value1 = control.get(controlName1)?.value;
      const value2 = control.get(controlName2)?.value;
      if (control.get(controlName2)?.errors && !control.get(controlName2)?.errors?.['confirmedValidator']) {
        return null;
      }
      if (value1 !== value2) {
          control.get(controlName2)?.setErrors({ confirmedValidator: true });
      } else {
          control.get(controlName2)?.setErrors(null);
      }
      return null;
  };
}
