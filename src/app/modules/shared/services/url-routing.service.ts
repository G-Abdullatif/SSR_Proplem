import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MyResponseSingle } from '../models/response';

@Injectable({
    providedIn: 'root'
})
export class UrlRoutingService {
    API_URL = `${environment.apiUrl}URLRouting/`;

    constructor(private http: HttpClient) { }

    getPageByURLName(url): Observable<MyResponseSingle> {
        return this.http.get<MyResponseSingle>(this.API_URL + 'GetPageByURLName?urlName=' + url);
    }
}
