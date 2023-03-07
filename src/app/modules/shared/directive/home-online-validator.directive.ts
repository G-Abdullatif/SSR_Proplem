import { AbstractControl } from '@angular/forms';

export class HomeOnlineValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static CheckIsHomeOrIsOnline(control: AbstractControl) {
    const isHome = control.get('isHome').value;
    const isOnline = control.get('isOnline').value;

    const isOneSelected = isHome || isOnline;
    if (!isOneSelected) {
      control.get('isOnline').setErrors({ IsHomeOrIsOnline: true });
    } else {
      return null;
    }
  }
}
