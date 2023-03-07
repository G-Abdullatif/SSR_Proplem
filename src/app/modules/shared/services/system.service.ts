import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MyResponseSingle } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  API_URL = `${environment.apiUrl}System/`;

  constructor(private http: HttpClient) { }

  getPrivacyPolicy(): Observable<MyResponseSingle> {
    return this.http.get<MyResponseSingle>(this.API_URL + 'GetPrivacyPolicy');
  }
}
