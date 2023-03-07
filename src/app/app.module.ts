import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/_services/auth.service';
import { environment } from 'src/environments/environment';
// Highlight JS
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { SplashScreenModule } from './_metronic/partials/layout/splash-screen/splash-screen.module';
// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';
// #fake-end#
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RestApiInterceptor } from './modules/shared/services/interceptor.interceptor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LocalizationResourcesService } from './modules/localization-resources/services/localization-resources.service';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import localeEn from '@angular/common/locales/en';
import localeTr from '@angular/common/locales/tr';
import { GlobalErrorHandler } from './modules/shared/services/global-error-handler.service';
import { DateAgoPipe } from './pipes/date-ago.pipe';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ImageCropperModule } from './modules/image-cropper/image-cropper.module';

function appInitializer(authService: AuthService) {
    return () => {
        return new Promise((resolve) => {
            const isRTL = JSON.parse(localStorage.getItem('languageObj')) ? JSON.parse(localStorage.getItem('languageObj')).isRTL : false;
            if (isRTL && localStorage.getItem('currentUrl') !== '/') {
                changeHtmlTag('rtl');
                loadTheme('style-rtl.css');
                registerLocaleData(localeAr);
            } else {
                changeHtmlTag('ltr');
                loadTheme('style-ltr.css');
                registerLocaleData(localeEn);
                registerLocaleData(localeTr);
            }
            authService.getUserByToken().subscribe().add(resolve);
        });
    };
}

function loadTheme(cssFile: string) {
    const headEl = document.getElementsByTagName('head')[0];
    const existingLinkEl = document.getElementById('directionCss') as HTMLLinkElement;
    if (existingLinkEl) {
        existingLinkEl.href = cssFile;
    } else {
        const newLinkEl = document.createElement('link');
        newLinkEl.id = "directionCss";
        newLinkEl.rel = "stylesheet";
        newLinkEl.href = cssFile;
        headEl.appendChild(newLinkEl);
    }
}

function changeHtmlTag(direction: string) {
    const htmlEl = document.getElementsByTagName('html')[0];
    const bodyEl = document.getElementsByTagName('body')[0];
    if (direction === "ltr") {
        htmlEl.lang = "en";
        htmlEl.dir = "ltr";
        bodyEl.classList.add('LTR');
    } else {
        htmlEl.lang = "ar";
        htmlEl.dir = "rtl";
        bodyEl.classList.add('RTL');
    }
}


@NgModule({
    declarations: [AppComponent, DateAgoPipe],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserAnimationsModule,
        SplashScreenModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: LocalizationResourcesService,
                deps: [HttpClient]
            }
        }),
        HttpClientModule,
        HighlightModule,
        ClipboardModule,
        // #fake-start#
        environment.isMockEnabled
            ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
                passThruUnknownUrl: true,
                dataEncapsulation: false,
            })
            : [],
        // #fake-end#
        AppRoutingModule,
        InlineSVGModule.forRoot(),
        NgxPermissionsModule.forRoot(),
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRippleModule,
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireMessagingModule,
        ImageCropperModule,
        MDBBootstrapModule.forRoot(),
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            multi: true,
            deps: [AuthService],
        },
        { provide: HTTP_INTERCEPTORS, useClass: RestApiInterceptor, multi: true },
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                coreLibraryLoader: () => import('highlight.js/lib/core'),
                languages: {
                    xml: () => import('highlight.js/lib/languages/xml'),
                    typescript: () => import('highlight.js/lib/languages/typescript'),
                    scss: () => import('highlight.js/lib/languages/scss'),
                    json: () => import('highlight.js/lib/languages/json')
                },
            },
        },
        NgbActiveModal
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
