import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LanguagesService } from 'src/app/modules/languages/services/languages.service';
import { RestParams } from 'src/app/modules/shared/models/params';
import { TranslationService } from '../../../../../modules/i18n/translation.service';
import { environment } from "../../../../../../environments/environment";
import { Language } from 'src/app/modules/shared/models/language';

@Component({
    selector: 'app-language-selector',
    templateUrl: './language-selector.component.html',
    styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {
    imagePath = environment.apiUrl + 'img/Language/natural/';
    defaultImage = environment.apiUrl + 'img/default.jpg';
    language: Language;
    languages: Language[] = [];
    constructor(
        private translationService: TranslationService,
        private languagesService: LanguagesService,
        private router: Router
    ) { }

    ngOnInit() {
        this.getLanguages().subscribe(lan => {
            localStorage.setItem('systemLanguages', JSON.stringify(lan.data));
            this.languages = lan.data;
            this.setSelectedLanguage();
            if (this.translationService.getSelectedLanguage() === undefined) {
                this.setLanguage('EN');
            }
        });
        this.router.events
            .pipe(filter((event) => event instanceof NavigationStart))
            .subscribe(() => this.setSelectedLanguage());
    }

    setLanguageWithRefresh(lang) {
        this.setLanguage(lang);
        window.location.reload();
    }

    setLanguage(lang: string) {
        this.languages.forEach((language: Language) => {
            if (language.code?.toUpperCase() === lang?.toUpperCase()) {
                language.isActive = true;
                this.language = language;
            } else {
                language.isActive = false;
            }
        });
        this.translationService.setLanguage(lang, this.language?.id, this.language);
    }

    setSelectedLanguage(): any {
        this.setLanguage(this.translationService.getSelectedLanguage());
    }

    getLanguages(): Observable<Languages> {
        const param: RestParams = new RestParams(['Name']);
        return this.languagesService.getIsActive(param);
    }

}
export class Languages {
    data: Language[];
}
