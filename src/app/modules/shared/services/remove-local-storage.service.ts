import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemoveLocalStorageService {
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor() { }

  removeLocalStorage() {
    localStorage.removeItem(this.authLocalStorageToken);
    localStorage.removeItem('userType');
    localStorage.removeItem('Role');
    localStorage.removeItem('permissions');
    localStorage.removeItem('accountId');
    localStorage.removeItem('previousUrl');
    localStorage.removeItem('fcm_token');
    localStorage.removeItem('iEvangelist.videoChat.videoInputId');
  }
}
