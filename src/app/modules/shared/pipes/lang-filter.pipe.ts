import { Pipe, PipeTransform } from '@angular/core';
import { LanguagesService } from '../../languages/services/languages.service';

@Pipe({
  name: 'langFilter'
})
export class LangFilterPipe implements PipeTransform {
  languageId: number;
  constructor(private languagesService: LanguagesService) { }
  transform(translations: any[], name: string): string {
    this.languageId = +localStorage.getItem('languageId');
    let result: string = '';
    if (translations) {      
      translations.forEach(element => {
        if(element.languageId === this.languageId) {
          result = element[name];
        }
      });
    }
    return result;
  }

}
