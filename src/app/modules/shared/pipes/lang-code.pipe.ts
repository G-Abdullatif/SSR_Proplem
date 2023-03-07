import { Pipe, PipeTransform } from '@angular/core';
import { Language } from '../models/language';

@Pipe({
  name: 'langCode'
})
export class LangCodePipe implements PipeTransform {
  languages: Language[] = [new Language()];

  transform(languageId: number): string {
    this.languages = JSON.parse(localStorage.getItem('systemLanguages'));
    return this.languages.find((lang) => languageId===lang.id).code;
  }

}
