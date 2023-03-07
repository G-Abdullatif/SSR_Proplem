import { HostListener, Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpHeaders,
    HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthModel } from '../../auth';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SplashScreenService } from 'src/app/_metronic/partials/layout/splash-screen/splash-screen.service';
import { ViewportScroller } from '@angular/common';
import { RemoveLocalStorageService } from './remove-local-storage.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class RestApiInterceptor implements HttpInterceptor {
    pageYoffset = 0;
    private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
    previousUrl = null;
    Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    @HostListener('window:scroll', ['$event']) onScroll(event) {
        this.pageYoffset = window.pageYOffset;
    }
    constructor(
        private scroll: ViewportScroller,
        private router: Router,
        private removeLocalStorageService: RemoveLocalStorageService,
        private splashScreenService: SplashScreenService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get("skip")) {
            return next.handle(req);
        }
        if (
            req.url.search('CreateOrUpdate') !== -1 ||
            req.url.search('GetById') !== -1 ||
            req.url.search('GetPageByURLName') !== -1 ||
            req.url.search('GetByCategoryId') !== -1 ||
            req.url.search('ChangeStatus') !== -1 ||
            req.url.search('ChangePassword') !== -1 ||
            req.url.search('ChangeNotificationSetting') !== -1 ||
            req.url.search('ForgotPassword') !== -1 ||
            req.url.search('ResetPasswordByCode') !== -1 ||
            req.url.search('User/SignIn') !== -1 ||
            req.url.search('User/Register') !== -1 ||
            req.url.search('Page/GetByURLName') !== -1 ||
            req.url.search('Product/GetIsActive') !== -1

        ) {
            this.splashScreenService.toggle(true);
            this.scroll.scrollToPosition([0, 0]);
            this.disableScroll();
        }
        const userToken = this.getAuthFromLocalStorage()?.jwtToken;
        let langId = '1';
        if (localStorage.getItem('languageObj') !== null) {
            langId = JSON.parse(localStorage.getItem('languageObj'))?.id.toString() || '1';
        }
        const modifiedReq = req.clone({
            headers: new HttpHeaders({
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `bearer ${userToken}`,
                LanguageID: langId
            })
        });
        return next.handle(modifiedReq).pipe(
            tap((res: HttpResponse<any>) => {
                if (res.body) {
                    if (res.body.state) {
                        if (res.body.messages === undefined || res.body.messages.length === 0) {
                            res.body.messages = ['Operation done successfully!'];
                        }
                        if (
                            req.url.search('CreateOrUpdate') !== -1 ||
                            req.url.search('ChangeStatus') !== -1 ||
                            req.url.search('ChangePassword') !== -1 ||
                            req.url.search('ChangeNotificationSetting') !== -1 ||
                            req.url.search('User/Register') !== -1||
                            req.url.search('User/SignIn') !== -1
                        ) {
                            this.splashScreenService.toggle(false);
                            this.enableScroll();
                            this.Toast.fire({
                                icon: 'success',
                                title: res.body.messages[0]
                            });
                        } else if (
                            req.url.search('ResetPasswordByCode') !== -1 ||
                            req.url.search('GetPageByURLName') !== -1 ||
                            req.url.search('GetByCategoryId') !== -1 ||
                            req.url.search('Page/GetByURLName') !== -1 ||
                            req.url.search('Product/GetIsActive') !== -1 ||
                            req.url.search('GetById') !== -1) {
                            this.splashScreenService.toggle(false);
                            this.enableScroll();
                        }
                    } else {
                        if (req.url.search('GetIdFromUniqueName') !== -1 || req.url.search('ForgotPassword') !== -1) {
                            return
                        }
                        if (res.body.messages === undefined || res.body.messages.length === 0) {
                            res.body.messages = ['Something went wrong!'];
                        }
                        this.splashScreenService.toggle(false);
                        this.enableScroll();
                        Swal.fire(
                            'Warning!',
                            res.body.messages[0],
                            'warning'
                        );
                    }

                }
            }), catchError(error => {
                this.splashScreenService.toggle(false);
                this.enableScroll();
                if (error.status === 401) {
                    this.removeLocalStorageService.removeLocalStorage();
                    Swal.fire(
                        'Warning!',
                        'Session is was expires!',
                        'warning'
                    ).then((res => {
                        //if (this.previousUrl === null) {
                        //  this.previousUrl = localStorage.getItem('previousUrl');
                        //}
                        this.router.navigate(["auth/login"]);
                    }));
                } else if (error.status === 403) {
                    Swal.fire(
                        'Error!',
                        'You Do Not have permission!',
                        'error'
                    ).then((res => {
                        //this.router.navigate(['/']);
                    }));
                } else if (error.status === 500) {
                    Swal.fire(
                        'Error!',
                        'Internal Server Error!',
                        'error'
                    ).then((res => {
                        //this.router.navigate(['/']);
                    }));
                }
                return throwError(error);
            }), finalize(() => {
                this.splashScreenService.toggle(false);
                this.enableScroll();
            })
        );
    }

    private getAuthFromLocalStorage(): AuthModel {
        try {
            const authData = JSON.parse(
                localStorage.getItem(this.authLocalStorageToken)
            );
            return authData;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    disableScroll() {
        document.body.style.overflow = 'hidden';
    }

    enableScroll() {
        document.body.style.overflow = 'auto';
    }
}
