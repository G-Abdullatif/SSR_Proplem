import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITableState, TableResponseModel, TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { MyResponseList, MyResponseSingle } from '../../shared/models/response';
import { Page } from '../models/page';
import { RestParams } from '../../shared/models/params';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { UrlRoutingService } from '../../shared/services/url-routing.service';

@Injectable({
    providedIn: 'root'
})
export class PageService extends TableService<Page> implements OnDestroy {
    isDataLoaded$: BehaviorSubject<boolean>;
    private _params: RestParams = new RestParams(['Title', 'Description']);
    API_URL = `${environment.apiUrl}Page/`;
    constructor(@Inject(HttpClient) http, private router: Router, private sanitizer: DomSanitizer, private urlRoutingService: UrlRoutingService) {
        super(http);
        this.isDataLoaded$ = new BehaviorSubject<boolean>(false);
    }
    private readonly _pages$ = new BehaviorSubject<Page[]>([]);
    _pages: Page[] = [];
    get pages(): Page[] {
        return this._pages$.value;
    }
    set pages(nextState: Page[]) {
        this._pages$.next(nextState);
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

    // READ
    find(tableState: ITableState): Observable<TableResponseModel<Page>> {
        return this.http.get<MyResponseList>(this.API_URL + 'GetAll?' +
            Object.keys(this.params).map(key => key + '=' + this.params[key]).join('&')).pipe(
                map((response: MyResponseList) => {
                    this._total$.next(response.totalRecord);
                    this._pages = (response.data as Page[]);
                    this._pages$.next(this._pages);
                    const filteredResult = baseFilter(response.data, tableState);
                    const result: TableResponseModel<Page> = {
                        items: filteredResult.items,
                        total: filteredResult.total
                    };
                    return result;
                })
            );
    }

    updatePages(updatedPage: Page) {
        const index = this._pages.findIndex(c => c.id === updatedPage.id);
        if (index === -1) {
            this._pages.push(updatedPage);
        } else {
            this._pages[index] = updatedPage;
        }
        this._pages$.next(this._pages); // emit completely new value
    }

    getData(): Observable<MyResponseList> {
        return this.http.get<MyResponseList>(this.API_URL + 'GetAll?' +
            Object.keys(this.params).map(key => key + '=' + this.params[key]).join('&'));
    }

    getIsActive(): Observable<MyResponseList> {
        return this.http.get<MyResponseList>(this.API_URL + 'GetIsActive?' +
            Object.keys(this.params).map(key => key + '=' + this.params[key]).join('&'));
    }

    getPageById(id): Observable<MyResponseSingle> {
        return this.http.get<MyResponseSingle>(this.API_URL + 'GetById?id=' + id);
    }

    getPageByCategoryId(CategoryId): Observable<MyResponseList> {
        return this.http.get<MyResponseList>(this.API_URL + 'GetByCategoryId?categoryId=' + CategoryId);
    }

    getByURLName(urlName): Observable<MyResponseSingle> {
        return this.http.get<MyResponseSingle>(this.API_URL + 'GetByURLName?urlName=' + urlName );
    }
    getPage(urlName) {
        if (urlName == null) {
            this.router.navigate(['/home'])
        }
        else {
            this.router.navigate(["/home/" + urlName]);
            this.isDataLoaded$.next(true);
            const sb = this.urlRoutingService.getPageByURLName(urlName).pipe(
                first(),
                catchError((errorMessage) => {
                    console.error(errorMessage);
                    this.isDataLoaded$.next(false);
                    return of(new Page(0));
                })).subscribe((page: MyResponseSingle) => {
                    if (page.data !== undefined && page.data !== null) {
                        this._pages$.next([page.data]);
                    }
                    this.isDataLoaded$.next(false);
                });
            this.subscriptions.push(sb);
        }
    }
    changeIsActive(pageState): Observable<MyResponseList> {
        return this.http.post<MyResponseList>(this.API_URL + 'ChangeIsActive?' +
            Object.keys(pageState).map(key => key + '=' + pageState[key]).join('&'), pageState);
    }

    createOrUpdatePage(page: Page): Observable<MyResponseSingle> {
        return this.http.post<MyResponseSingle>(this.API_URL + 'CreateOrUpdate', page);
    }
   
    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
