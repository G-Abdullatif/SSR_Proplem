import { BaseModel } from '../../../_metronic/shared/crud-table';
import { environment } from "../../../../environments/environment";
import { Language } from '../../shared/models/language';
const USERDATA_DATA = `${environment.appVersion}-${environment.USERDATA_KEY}`;

export class LocalizationResources implements BaseModel {
    id: number;
    key: string;
    value: string;
    languageId: number;
    languageName: string;
    isActive: boolean;
    isDeleted: boolean;
    operatorId: number;
    userOperationType: number;
    languageWordTranslation: Translation[];
    constructor(languages: Language[]) {
      this.languageWordTranslation = [];
      languages.forEach(lang => {
        this.languageWordTranslation.push(new Translation(lang));
      })
      this.operatorId = JSON.parse(localStorage.getItem(USERDATA_DATA)).id;
    }
}

export class Translation {
    id: number;
    languageWordId: number;
    languageId: number;
    value: string;
    isActive: boolean;
    isDeleted: boolean;
    operatorId: number;
    userOperationType: number;
    constructor(language: Language) {
      this.languageId = language.id;
    }
}