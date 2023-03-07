import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../index';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { SplashScreenService } from '../../../_metronic/partials/layout/splash-screen/splash-screen.service';
import { phoneValidator } from "../../shared/directive/phone-validator.directive";
import intlTelInput from 'intl-tel-input';
import utilsScript from 'intl-tel-input/build/js/utils.js';
import { environment } from 'src/environments/environment';
import { Language } from '../../shared/models/language';
import { TranslationService } from '../../../modules/i18n/translation.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    private phone: ElementRef;
    iti = undefined;
    @ViewChild('phone') set content(content: ElementRef) {
        if (content) { // initially setter gets called with undefined
            this.phone = content;
            this.iti = intlTelInput(this.phone.nativeElement, {
                utilsScript: utilsScript,
                preferredCountries: ['SA', 'TR'],
                separateDialCode: true,
                nationalMode: false
            });
        }
    }
    defaultEmailAuth = {
        email: '',
        password: '',
    };
    defaultPhoneAuth = {
        phone: '',
        password: '',
    };
    isLoginWithPhone: boolean = false;
    loginForm: UntypedFormGroup;
    hasError: boolean;
    returnUrl: string;
    isLoading$: Observable<boolean>;
    defaultImage = environment.apiUrl + 'img/default.jpg';
    imagePath = environment.apiUrl + 'img/Language/natural/';
    language: Language;
    languages: Language[] = [new Language()];
    environment = environment;
    fieldTextType: boolean;


    // private fields
    private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    constructor(
        private fb: UntypedFormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private permissionsService: NgxPermissionsService,
        private ngxRolesService: NgxRolesService,
        public translationService: TranslationService,
        private splashScreenService: SplashScreenService
    ) {
        this.isLoading$ = this.authService.isLoading$;
        // redirect to home if already logged in
        if (this.authService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit(): void {
        this.languages = JSON.parse(localStorage.getItem('systemLanguages')) || [new Language()];
        this.language = JSON.parse(localStorage.getItem('languageObj')) || new Language();
        this.languages = this.languages.filter(lang => lang.code !== this.language.code);
        this.initForm();
        // get return url from route parameters or default to '/'
        if (localStorage.getItem("returnUrl") != undefined) {
            this.returnUrl = localStorage.getItem("returnUrl")
            localStorage.removeItem("returnUrl")
        } else {
            this.returnUrl =
                this.route.snapshot.queryParams['returnUrl'.toString()] || '/dashboard';
        }
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    initForm() {
        if (this.isLoginWithPhone) {
            this.loginForm = this.fb.group({
                phone: [
                    this.defaultPhoneAuth.phone,
                    Validators.compose([
                        Validators.required
                    ]),
                ],
                password: [
                    this.defaultEmailAuth.password,
                    Validators.compose([
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(100),
                    ]),
                ],
                isRememberMe: true,
                recaptchaReactive: [null, Validators.required]
            });
            setTimeout(() => {
                this.loginForm.get('phone').setValidators(phoneValidator(this.iti));
            }, 0);
        } else {
            this.loginForm = this.fb.group({
                email: [
                    this.defaultEmailAuth.email,
                    Validators.compose([
                        Validators.required,
                        Validators.email,
                        Validators.minLength(3),
                        Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
                    ]),
                ],
                password: [
                    this.defaultEmailAuth.password,
                    Validators.compose([
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(100),
                    ]),
                ],
                isRememberMe: true,
                recaptchaReactive: [null, Validators.required]
            });
        }
    }

    submit() {
        this.hasError = false;
        this.splashScreenService.toggle(true);
        let [emailOrPhoneNumber, password, loginBy, isRememberMe] = ['', '', 0, false];
        if (this.isLoginWithPhone) {
            [emailOrPhoneNumber, password, loginBy, isRememberMe] = [this.iti.getNumber(), this.f.password.value, 2, this.f.isRememberMe.value];
        } else {
            [emailOrPhoneNumber, password, loginBy, isRememberMe] = [this.f.email.value, this.f.password.value, 1, this.f.isRememberMe.value];
        }
        const loginSubscr = this.authService
            .login(emailOrPhoneNumber, password, loginBy, isRememberMe)
            .pipe(first())
            .subscribe((user: UserModel) => {
                if (user) {
                    let permissions = [];
                    switch (user.userType) {
                        case 1:
                            permissions = [];
                            this.ngxRolesService.addRoleWithPermissions('ADMIN', permissions);
                            localStorage.setItem('Role', 'ADMIN');
                            break;
                        default:
                            break;
                    }
                    this.permissionsService.loadPermissions(permissions);
                    localStorage.setItem('permissions', JSON.stringify(permissions));
                    localStorage.setItem('accountId', JSON.stringify(user.accountId));
                    localStorage.setItem('userType', JSON.stringify(user.userType));
                    this.splashScreenService.toggle(false);
                    window.location.href = this.returnUrl
                    //this.router.navigate([this.returnUrl]);
                } else {
                    this.loginForm.get('recaptchaReactive').reset();
                    this.hasError = true;
                    setTimeout(() => {
                        this.splashScreenService.toggle(false);
                    }, 500);
                }
            });
        this.unsubscribe.push(loginSubscr);
    }

    toggleLoginWithPhone() {
        this.isLoginWithPhone = !this.isLoginWithPhone;
        this.initForm();
    }

    // helpers for View
    isControlValid(controlName: string): boolean {
        const control = this.loginForm.controls[controlName];
        return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.loginForm.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }

    changeLang(lang: Language) {
        this.translationService.setLanguage(lang.code, lang.id, lang);
        document.location.reload();
    }

    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
    }

    resolved(captchaResponse: string) {
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
}
