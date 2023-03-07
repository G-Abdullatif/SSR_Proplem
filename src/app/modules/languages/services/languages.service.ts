import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { param } from 'jquery';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { RestParams } from '../../shared/models/params';
import { MyResponseList, MyResponseSingle } from '../../shared/models/response';
import { Language } from "../models/languages";

@Injectable({
  providedIn: 'root'
})
export class LanguagesService extends TableService<Language> implements OnDestroy{
  API_URL = `${environment.apiUrl}Language/`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
  
  private readonly _languages$ = new BehaviorSubject<Language[]>([]);
  get languages(): Language[]{
    return this._languages$.value;
  }
  set languages(nextState: Language[]) {
    this._languages$.next(nextState);
  }

  private _params: RestParams = new RestParams(['Name']);
  get params(): RestParams{
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
  find(tableState: ITableState): Observable<TableResponseModel<Language>> {
    return this.http.get<MyResponseList>(this.API_URL + 'GetAll?' +
          Object.keys(this.params).map(key => key + '=' + this.params[key]).join('&')).pipe(
      map((response: MyResponseList) => {
        this._total$.next(response.totalRecord);
        this.languages = (response.data as Language[]);
        this._languages$.next(this.languages);
        const filteredResult = baseFilter(response.data, tableState);
        const result: TableResponseModel<Language> = {
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

  getLanguageById(id): Observable<MyResponseSingle>  {
    return this.http.get<MyResponseSingle>(this.API_URL + 'GetById?id=' + id);
  }

  
  updateLanguages(updatedLanguage: Language) {
    const index = this.languages.findIndex(c => c.id === updatedLanguage.id);
    if (index === -1) {
      this.languages.push(updatedLanguage);
    } else {
      this.languages[index] = updatedLanguage;
    }
    this._languages$.next(this.languages); // emit completely new value
  }

  changeIsActive(languageState): Observable<MyResponseList>{
    return this.http.post<MyResponseList>(this.API_URL + 'ChangeIsActive?' +
          Object.keys(languageState).map(key => key + '=' + languageState[key]).join('&') , languageState);
  }

  createOrUpdateLanguage(language: Language): Observable<MyResponseSingle> {
    return this.http.post<MyResponseSingle>(this.API_URL + 'CreateOrUpdate', language);
  }

    getIsActive(params): Observable<any> {
        params.orderBy = 'Sort';
    return this.http.get<MyResponseList>(this.API_URL + 'GetIsActive?' +
          Object.keys(params).map(key => key + '=' + params[key]).join('&'));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
