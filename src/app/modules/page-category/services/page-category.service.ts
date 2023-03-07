import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITableState, TableResponseModel, TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { MyResponseList, MyResponseSingle } from '../../shared/models/response';
import { RestParams } from '../../shared/models/params';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { PageCategory } from '../models/page-category';

@Injectable({
    providedIn: 'root'
})
export class PageCategoryService extends TableService<PageCategory> implements OnDestroy {
    isDataLoaded$: BehaviorSubject<boolean>;
    private _params: RestParams = new RestParams(['Title', 'Description']);
    API_URL = `${environment.apiUrl}PageCategory/`;
    constructor(@Inject(HttpClient) http, private router: Router,    private sanitizer: DomSanitizer) {
        super(http);
        this.isDataLoaded$ = new BehaviorSubject<boolean>(false);
    }
    private readonly _pageCategorys$ = new BehaviorSubject<PageCategory[]>([]);
    _pageCategorys: PageCategory[] = [];
    get pageCategorys(): PageCategory[] {
        return this._pageCategorys$.value;
    }
    set pageCategorys(nextState: PageCategory[]) {
        this._pageCategorys$.next(nextState);
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


    updatePageCategorys(updatedPageCategory: PageCategory) {
        const index = this._pageCategorys.findIndex(c => c.id === updatedPageCategory.id);
        if (index === -1) {
            this._pageCategorys.push(updatedPageCategory);
        } else {
            this._pageCategorys[index] = updatedPageCategory;
        }
        this._pageCategorys$.next(this._pageCategorys); // emit completely new value
    }

    getData(): Observable<MyResponseList> {
        return this.http.get<MyResponseList>(this.API_URL + 'GetAll?' +
            Object.keys(this.params).map(key => key + '=' + this.params[key]).join('&'));
    }

    getIsActive(): Observable<MyResponseList> {
        return this.http.get<MyResponseList>(this.API_URL + 'GetIsActive?' +
            Object.keys(this.params).map(key => key + '=' + this.params[key]).join('&'));
    }

    getPageCategoryById(id): Observable<MyResponseSingle> {
        return this.http.get<MyResponseSingle>(this.API_URL + 'GetById?id=' + id);
    }

    getByURLName(urlName): Observable<MyResponseSingle> {
        return this.http.get<MyResponseSingle>(this.API_URL + 'GetByURLName?urlName=' + urlName );
    }
    getPageCategory(urlName) {
        if (urlName == null)
            this.router.navigate(['/home'])
        this.isDataLoaded$.next(true);
        const sb = this.getByURLName(urlName).pipe(
            first(),
            catchError((errorMessage) => {
                console.error(errorMessage);
                this.isDataLoaded$.next(false);
                return of(new PageCategory(0));
            })).subscribe((pageCategory: MyResponseSingle) => {
                if (pageCategory.data !== undefined && pageCategory.data !== null) {
                    pageCategory.data.content = this.sanitizer.bypassSecurityTrustHtml(pageCategory.data.content);
                    this._pageCategorys$.next([pageCategory.data]);
                }
                this.isDataLoaded$.next(false);
            });
        this.subscriptions.push(sb);
    }
    changeIsActive(pageCategoryState): Observable<MyResponseList> {
        return this.http.post<MyResponseList>(this.API_URL + 'ChangeIsActive?' +
            Object.keys(pageCategoryState).map(key => key + '=' + pageCategoryState[key]).join('&'), pageCategoryState);
    }

    createOrUpdatePageCategory(pageCategory: PageCategory): Observable<MyResponseSingle> {
        return this.http.post<MyResponseSingle>(this.API_URL + 'CreateOrUpdate', pageCategory);
    }
   
    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
