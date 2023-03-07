import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { RestParams } from '../../shared/models/params';
import { MyResponseList, MyResponseSingle } from '../../shared/models/response';
import { LocalizationResources } from "../models/localization-resources";

@Injectable({
    providedIn: 'root'
})
export class LocalizationResourcesService extends TableService<LocalizationResources> implements OnDestroy, TranslateLoader {
    API_URL = `${environment.apiUrl}LanguageWord/`;
    constructor(@Inject(HttpClient) http) {
        super(http);
    }

    private readonly _localizationResources$ = new BehaviorSubject<LocalizationResources[]>([]);
    get localizationResources(): LocalizationResources[] {
        return this._localizationResources$.value;
    }
    set localizationResources(nextState: LocalizationResources[]) {
        this._localizationResources$.next(nextState);
    }

    private _params: RestParams = new RestParams(['Key', 'Value']);
    get params(): RestParams {
        return this._params;
    }
    set params(params) {
        this._params = params;
    }

    private _total$ = new BehaviorSubject<number>(0);
    get total$() {
        return this._total$.asObservable();
    }

    // READ
    find(tableState: ITableState): Observable<TableResponseModel<LocalizationResources>> {
        return this.http.get<MyResponseList>(this.API_URL + 'GetAll?' +
            Object.keys(this.params).map(key => key + '=' + this.params[key]).join('&')).pipe(
                map((response: MyResponseList) => {
                    this._total$.next(response.totalRecord);
                    this.localizationResources = (response.data as LocalizationResources[]);
                    this._localizationResources$.next(this.localizationResources);
                    const filteredResult = baseFilter(response.data, tableState);
                    const result: TableResponseModel<LocalizationResources> = {
                        items: filteredResult.items,
                        total: filteredResult.total
                    };
                    return result;
                })
            );
    }

    getData(): Observable<MyResponseList> {
        return this.http.get<MyResponseList>(this.API_URL + 'GetAll?' +
            Object.keys(this.params).map(key => key + '=' + this.params[key]).join('&'));
    }

    getLocalizationResourceById(id): Observable<MyResponseSingle> {
        return this.http.get<MyResponseSingle>(this.API_URL + 'GetById?id=' + id);
    }


    updateLocalizationResources(updatedLocalizationResource: LocalizationResources) {
        const index = this.localizationResources.findIndex(c => c.id === updatedLocalizationResource.id);
        if (index === -1) {
            this.localizationResources.push(updatedLocalizationResource);
        } else {
            this.localizationResources[index] = updatedLocalizationResource;
        }
        this._localizationResources$.next(this.localizationResources); // emit completely new value
    }

    changeIsActive(status): Observable<MyResponseList> {
        return this.http.post<MyResponseList>(this.API_URL + 'ChangeIsActive?' +
            Object.keys(status).map(key => key + '=' + status[key]).join('&'), status);
    }

    createOrUpdateLocalizationResource(localizationResource: LocalizationResources): Observable<MyResponseSingle> {
        return this.http.post<MyResponseSingle>(this.API_URL + 'CreateOrUpdate', localizationResource);
    }

    getIsActive(): Observable<any> {
        return this.http.get<MyResponseList>(this.API_URL + 'GetIsActive');
    }

    getTranslation(lang: string): Observable<any> {
        return this.getIsActive().pipe(
            map((res: any) => {
                var reformattedArray = res.data.map(obj => {
                    var rObj = {};
                    rObj[obj.key] = obj.value;
                    return rObj;
                });
                return Object.assign({}, ...reformattedArray);
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
