// Localization is based on '@ngx-translate/core';
// Please be familiar with official documentations first => https://github.com/ngx-translate/core

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../shared/models/language';

export interface Locale {
  lang: string;
  data: any;
}

const LOCALIZATION_LOCAL_STORAGE_KEY = 'language';
const LOCALIZATION_LOCAL_STORAGE_KEY_ID = 'languageId';
const LOCALIZATION_LOCAL_STORAGE_KEY_FULL_OBJ = 'languageObj';
const LOCALIZATION_LOCAL_STORAGE_KEY_isRTL = 'isRTL';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {

  constructor(private translate: TranslateService) {
    // add new langIds to the list
    this.translate.addLangs(['en']);
  }

  setLanguage(lang, languageId, fullLangObj: Language) {
    if (lang) {
      this.translate.use(this.translate.getDefaultLang());
      this.translate.use(lang.toLowerCase());
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang);
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY_ID, languageId);
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY_FULL_OBJ, JSON.stringify(fullLangObj));
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY_isRTL, JSON.stringify(fullLangObj.isRTL));
    }
  }

  /**
   * Returns selected language
   */
  getSelectedLanguage(): any {
    return (
      localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) ||
      this.translate.getDefaultLang()
    );
  }
}
