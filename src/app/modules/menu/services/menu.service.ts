import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITableState, TableResponseModel, TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyResponseList, MyResponseSingle } from '../../shared/models/response';
import { RestParams } from '../../shared/models/params';
import { Menu } from '../models/menu';

@Injectable({
    providedIn: 'root'
})
export class MenuService extends TableService<Menu> implements OnDestroy {
    private _params: RestParams = new RestParams(['Name', 'URLName']);
    API_URL = `${environment.apiUrl}Menu/`;
    constructor(@Inject(HttpClient) http) {
        super(http);
    }
    private readonly _menus$ = new BehaviorSubject<Menu[]>([]);
    _menus: Menu[] = [];
    get menus(): Menu[] {
        return this._menus$.value;
    }
    set menus(nextState: Menu[]) {
        this._menus$.next(nextState);
    }
    private _total$ = new BehaviorSubject<number>(0);
    get params(): RestParams {
        return this._params;
    }
    set params(params) {
        this._params = params;
    }

    get total$() {
        return this._total$.asObservable();
    }

    updateMenus(updatedMenu: Menu) {
        const index = this._menus.findIndex(c => c.id === updatedMenu.id);
        if (index === -1) {
            this._menus.push(updatedMenu);
        } else {
            this._menus[index] = updatedMenu;
        }
        this._menus$.next(this._menus); // emit completely new value
    }

    getData(): Observable<MyResponseList> {
        return this.http.get<MyResponseList>(this.API_URL + 'GetAll?' +
            Object.keys(this.params).map(key => key + '=' + this.params[key]).join('&'));
    }

    getIsActive(): Observable<MyResponseList> {
        return this.http.get<MyResponseList>(this.API_URL + 'GetIsActive?' +
            Object.keys(this.params).map(key => key + '=' + this.params[key]).join('&'));
    }

    getMenuById(id): Observable<MyResponseSingle> {
        return this.http.get<MyResponseSingle>(this.API_URL + 'GetById?id=' + id);
    }

    changeIsActive(menuState): Observable<MyResponseList> {
        return this.http.post<MyResponseList>(this.API_URL + 'ChangeIsActive?' +
            Object.keys(menuState).map(key => key + '=' + menuState[key]).join('&'), menuState);
    }

    createOrUpdateMenu(menu: Menu): Observable<MyResponseSingle> {
        return this.http.post<MyResponseSingle>(this.API_URL + 'CreateOrUpdate', menu);
    }
    
    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
