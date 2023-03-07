import { AbstractControl, ValidatorFn } from '@angular/forms';

export function phoneValidator(iti): ValidatorFn {
  const errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
  return (control: AbstractControl): {[key: string]: any} | null => {
    let isValid = false;
    if (iti?.isValidNumber()) {
      isValid = true;
    } else {
      var errorCode = iti?.getValidationError();
      errorMap[errorCode] = errorMap[errorCode] === undefined ? 'Invalid number' : errorMap[errorCode];
      isValid = false;
    }
    return isValid ? null : {phoneValidator: 'Phone number is ' + errorMap[errorCode]};
  };
}
