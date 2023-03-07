import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthComponent } from './auth.component';
import {TranslationModule} from '../i18n/translation.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from '../shared/modules/shared/shared.module';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { CreateNewPasswordComponent } from './create-new-password/create-new-password.component';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { MatSelectModule } from '@angular/material/select';
import { RECAPTCHA_LANGUAGE } from "ng-recaptcha";
@NgModule({
    providers: [
        {
            provide: RECAPTCHA_LANGUAGE,
            useValue: localStorage.getItem("language")
        },
    ],
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    LogoutComponent,
    AuthComponent,
    RecoverPasswordComponent,
    CreateNewPasswordComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCheckboxModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    MatSelectModule,
    SharedModule
  ]
})
export class AuthModule {}
