import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../index';
import { AuthModel } from '../index';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { RemoveLocalStorageService } from '../../shared/services/remove-local-storage.service';
import { MyResponseSingle } from '../../shared/models/response';
import { NotificationSettings } from '../_models/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    // private fields
    private unsubscribe: Subscription[] = [];
    private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

    // public fields
    currentUser$: Observable<UserModel>;
    isLoading$: Observable<boolean>;
    currentUserSubject: BehaviorSubject<UserModel>;
    isLoadingSubject: BehaviorSubject<boolean>;

    public redirectUrl: string;

    get currentUserValue(): UserModel {
        return this.currentUserSubject.value;
    }

    set currentUserValue(user: UserModel) {
        this.currentUserSubject.next(user);
    }

    emailOrPhoneNumber: string;
    resetBy: number;

    constructor(
        private authHttpService: AuthHTTPService,
        private router: Router,
        private removeLocalStorageService: RemoveLocalStorageService
    ) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
        this.currentUser$ = this.currentUserSubject.asObservable();
        this.isLoading$ = this.isLoadingSubject.asObservable();
    }
    // need create new user then login
    userRegistration(user: UserModel): Observable<any> {
        this.isLoadingSubject.next(true);
        return this.authHttpService.createAccount(user).pipe(
            res => {
                this.isLoadingSubject.next(false);
                return res;
            },
            catchError((err) => {
                console.error('err', err);
                return of(undefined);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    // public methods
    login(emailOrPhoneNumber: string, password: string, loginBy: number, isRememberMe: boolean): Observable<any> {
        this.isLoadingSubject.next(true);
        return this.authHttpService.login(emailOrPhoneNumber, password, loginBy, isRememberMe).pipe(
            map(({ data }: { data: UserModel }) => {
                const result = this.setAuthFromLocalStorage(data);
                return result;
            }),
            switchMap(() => this.getUserByToken()),
            catchError((err) => {
                console.error('err', err);
                return of(undefined);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    logout() {
        const auth = this.getAuthFromLocalStorage();
        const isAuth = auth && auth.jwtToken;
        this.redirectUrl = this.redirectUrl?.search('StartAppointment/videoCall') !== -1 ||
            this.redirectUrl?.search('Appointments/view') !== -1 ? '/' : this.redirectUrl;
        if (isAuth) {
            const sub = this.updateToken(null).subscribe(() => {
                this.router.navigate(['/auth/login'], {
                    queryParams: { returnUrl: this.redirectUrl }
                });
                document.location.reload();
                this.removeLocalStorageService.removeLocalStorage();
            });
            this.unsubscribe.push(sub);
        } else {
            this.router.navigate(['/auth/login'], {
                queryParams: { returnUrl: this.redirectUrl }
            });
            this.removeLocalStorageService.removeLocalStorage();
        }
    }

    getUserByToken(): Observable<UserModel> {
        const auth = this.getAuthFromLocalStorage();
        // #real
        const isAuth = !auth || !auth.jwtToken;
        // #fake
        // const isAuth = !auth || !auth.accessToken;
        if (isAuth) {
            return of(undefined);
        }

        this.isLoadingSubject.next(true);
        // #real
        const token = auth.jwtToken;
        // #fake
        // const token = auth.accessToken;
        return this.authHttpService.getUserByToken().pipe(
            map(({ data }: { data: UserModel }) => {
                if (data) {
                    // const me = user.data;
                    const me = data;
                    this.currentUserSubject = new BehaviorSubject<UserModel>(me);
                } else {
                    this.logout();
                }
                return data;
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    forgotPassword(emailOrPhoneNumber: string, resetBy: number): Observable<MyResponseSingle> {
        this.isLoadingSubject.next(true);
        return this.authHttpService
            .forgotPassword(emailOrPhoneNumber, resetBy)
            .pipe(finalize(() => this.isLoadingSubject.next(false)));
    }

    verifyResetCode(code: string): Observable<MyResponseSingle> {
        this.isLoadingSubject.next(true);
        return this.authHttpService
            .verifyResetCode(code)
            .pipe(finalize(() => this.isLoadingSubject.next(false)));
    }

    confirmChangeEmail(email: string, emailActivationCode: string): Observable<MyResponseSingle> {
        this.isLoadingSubject.next(true);
        return this.authHttpService
            .confirmChangeEmail(email, emailActivationCode)
            .pipe(finalize(() => this.isLoadingSubject.next(false)));
    }

    confirmChangePhoneNumber(phoneCountryCode: string, phoneNumber: string, phoneActivationCode: string): Observable<MyResponseSingle> {
        this.isLoadingSubject.next(true);
        return this.authHttpService
            .confirmChangePhoneNumber(phoneCountryCode, phoneNumber, phoneActivationCode)
            .pipe(finalize(() => this.isLoadingSubject.next(false)));
    }

    resetPasswordByCode(resetPasswordCode: string, password: string): Observable<MyResponseSingle> {
        this.isLoadingSubject.next(true);
        return this.authHttpService
            .resetPasswordByCode(resetPasswordCode, password)
            .pipe(finalize(() => this.isLoadingSubject.next(false)));
    }

    changePassword(currentPassowrd: string, newPassowrd: string): Observable<MyResponseSingle> {
        this.isLoadingSubject.next(true);
        return this.authHttpService
            .changePassword(currentPassowrd, newPassowrd)
            .pipe(finalize(() => this.isLoadingSubject.next(false)));
    }

    changeEmail(email: string): Observable<MyResponseSingle> {
        this.isLoadingSubject.next(true);
        return this.authHttpService
            .changeEmail(email)
            .pipe(finalize(() => this.isLoadingSubject.next(false)));
    }

    changeNotificationSetting(notificationSettings: NotificationSettings): Observable<MyResponseSingle> {
        this.isLoadingSubject.next(true);
        return this.authHttpService
            .changeNotificationSetting(notificationSettings)
            .pipe(finalize(() => this.isLoadingSubject.next(false)));
    }

    changePhoneNumber(phoneCountryCode: string, phoneNumber: string): Observable<MyResponseSingle> {
        this.isLoadingSubject.next(true);
        return this.authHttpService
            .changePhoneNumber(phoneCountryCode, phoneNumber)
            .pipe(finalize(() => this.isLoadingSubject.next(false)));
    }

    updateToken(token: string): Observable<MyResponseSingle> {
        this.isLoadingSubject.next(true);
        return this.authHttpService
            .updateToken(token)
            .pipe(finalize(() => this.isLoadingSubject.next(false)));
    }

    // private methods
    private setAuthFromLocalStorage(user: UserModel): boolean {
        // store auth accessToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
        // #real
        const isAuth = user && user.jwtToken;
        // #fake
        // const isAuth = auth && auth.accessToken;
        if (isAuth) {
            localStorage.setItem(this.authLocalStorageToken, JSON.stringify(user));
            return true;
        }
        return false;
    }

    getAuthFromLocalStorage(): AuthModel {
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

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
}
