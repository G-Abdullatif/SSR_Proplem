import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { first } from 'rxjs/operators';
import { phoneValidator } from '../../shared/directive/phone-validator.directive';
import intlTelInput from 'intl-tel-input';
import utilsScript from 'intl-tel-input/build/js/utils.js';
import { Language } from '../../shared/models/language';
import { MyResponseSingle } from '../../shared/models/response';
import { Router } from '@angular/router';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy{
  private phone: ElementRef;
  iti = undefined;
  @ViewChild('phone') set content(content: ElementRef) {
    if(content) { // initially setter gets called with undefined
        this.phone = content;
        this.iti = intlTelInput(this.phone.nativeElement, {
          utilsScript: utilsScript,
          preferredCountries: [ 'TR','SA'],
          separateDialCode: true,
          nationalMode: false
        });
      }
 }
  language: Language;
  isLoginWithPhone: boolean = false;
  forgotPasswordForm: UntypedFormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
    healthFacilityName = localStorage.getItem("healthFacilityName") || '';

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
      setTimeout(() => {
          this.healthFacilityName = localStorage.getItem("healthFacilityName") || ''
      }, 1000)
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.language = JSON.parse(localStorage.getItem('languageObj'));
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    if (this.isLoginWithPhone) {
      this.forgotPasswordForm = this.fb.group({
        phone: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ]
      });
      setTimeout(() => {
        this.forgotPasswordForm.get('phone').setValidators(phoneValidator(this.iti));
      }, 0);
    } else {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ]
    });
  }
  }

  toggleLoginWithPhone() {
    this.isLoginWithPhone =! this.isLoginWithPhone;
    this.initForm();
  }

  submit() {
    let [emailOrPhoneNumber, resetBy] = ['' , 0];
    if (this.isLoginWithPhone) {
       [emailOrPhoneNumber, resetBy] = [this.iti.getNumber(), 2];
    } else {
       [emailOrPhoneNumber, resetBy] = [this.f.email.value, 1];
    }
    this.errorState = ErrorStates.NotSubmitted;
    const forgotPasswordSubscr = this.authService
      .forgotPassword(emailOrPhoneNumber, resetBy)
      .pipe(first())
      .subscribe((result: MyResponseSingle) => {
        if (result.state) {
          this.errorState =  ErrorStates.NoError;
          this.authService.emailOrPhoneNumber = emailOrPhoneNumber;
          this.authService.resetBy = resetBy;
            this.router.navigate(['/' + this.healthFacilityName + '/auth/recover-password']);
        } else {
          this.errorState =  ErrorStates.HasError;
        }
      });
      this.initForm()
    this.unsubscribe.push(forgotPasswordSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
