import {
    Component,
    ChangeDetectionStrategy,
    OnDestroy,
    OnInit,
} from '@angular/core';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as jpLang } from './modules/i18n/vocabs/jp';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as frLang } from './modules/i18n/vocabs/fr';
import { locale as arLang } from './modules/i18n/vocabs/ar';
import { SplashScreenService } from './_metronic/partials/layout/splash-screen/splash-screen.service';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { TableExtendedService } from './_metronic/shared/crud-table';
import { NgxRolesService } from 'ngx-permissions';
import { UrlService } from './modules/shared/services/url.service';
import { environment } from '../environments/environment.prod';
import { AuthService } from './modules/auth';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {

    private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    previousUrl: string = null;
    systemConfig = JSON.parse(localStorage.getItem("systemConfiguration"));
    currentUrl: string = null;
    language: string = localStorage.getItem("language");
    WebSite: string;
    version = localStorage.getItem("version");
    constructor(
        private ngxRolesService: NgxRolesService,
        private splashScreenService: SplashScreenService,
        private router: Router,
        private tableService: TableExtendedService,
        public authService: AuthService,
        private urlService: UrlService,
    ) {
        if (this.version != environment.appVersion) {
            localStorage.clear();
            localStorage.setItem("version", environment.appVersion)
        } else {
            localStorage.setItem("version", environment.appVersion)
        }
        const subscription = router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                const browserRefresh = !router.navigated;
                if (browserRefresh) {
                    const permissions = JSON.parse(localStorage.getItem('permissions'));
                    const Role = localStorage.getItem('Role');
                    if (permissions && Role) {
                        this.ngxRolesService.addRoleWithPermissions(Role, permissions);
                    }
                }
            }
        });
        localStorage.setItem("apiUrl", environment.apiUrl)
        this.unsubscribe.push(subscription);
    
    }

    ngOnInit() {
        const routerSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.previousUrl = this.currentUrl;
                this.currentUrl = event.url;
                this.urlService.setPreviousUrl(this.previousUrl);
                if (this.previousUrl !== null) {
                    localStorage.setItem('previousUrl', this.previousUrl);
                    localStorage.setItem('currentUrl', this.currentUrl);
                }
                // clear filtration paginations and others
                this.tableService.setDefaults();
                // hide splash screen
                this.splashScreenService.hide();

                // scroll to top on every route change
                window.scrollTo(0, 0);

                // to display back the body content
                setTimeout(() => {
                    document.body.classList.add('page-loaded');
                }, 500);
            }
        });

        this.unsubscribe.push(routerSubscription);


        // <!--Start of Tawk.to Script-- >
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        var Tawk_API_Link = this.systemConfig.find(con => con.key == 'Live_Chat_Link').value;
        (function () {
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = Tawk_API_Link;
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
        })();
        //  < !--End of Tawk.to Script-- >
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
}
