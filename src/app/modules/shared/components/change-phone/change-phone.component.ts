import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService, UserModel } from '../../../auth';
import { phoneValidator } from '../../directive/phone-validator.directive';
import { MyResponseSingle } from '../../models/response';
import intlTelInput from 'intl-tel-input';
import utilsScript from 'intl-tel-input/build/js/utils.js';
import { Language } from '../../models/language';

@Component({
  selector: 'app-change-phone',
  templateUrl: './change-phone.component.html',
  styleUrls: ['./change-phone.component.scss']
})
export class ChangePhoneComponent implements OnInit {
  private phone: ElementRef;
  iti = undefined;
  @ViewChild('phone') set content(content: ElementRef) {
    if(content) { // initially setter gets called with undefined
        this.phone = content;
        this.iti = intlTelInput(this.phone.nativeElement, {
          utilsScript: utilsScript,
          preferredCountries: ['TR','SA'],
          nationalMode: false,
          separateDialCode: true
        });
      }
 }
  formGroup: UntypedFormGroup;
  user: UserModel;
  firstUserState: UserModel;
  subscriptions: Subscription[] = [];
  isLoading$: Observable<boolean>;
  isFormSubmitted = false;
  errorState: boolean = null;
  phoneNumber: string;
  phoneCountryCode: string;
  language: Language;
  constructor(
    private router: Router,
    private authService: AuthService, 
    private fb: UntypedFormBuilder) {
    this.isLoading$ = this.authService.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.language = JSON.parse(localStorage.getItem('languageObj')) || new Language();
    const sb = this.authService.currentUserSubject.asObservable().pipe(
      first(user => !!user)
    ).subscribe(user => {
      user.phoneNumber = '';
      this.user = Object.assign({}, user);
      this.firstUserState = Object.assign({}, user);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    this.formGroup = this.fb.group({
      phoneNumber: [this.user.phoneNumber,
        Validators.compose([
          Validators.required
        ]),
      ],
      phoneCountryCode: null
    });
    setTimeout(() => {
      this.formGroup.get('phoneNumber').setValidators(phoneValidator(this.iti));
    }, 0);
  }

  save() {
    this.formGroup.get('phoneCountryCode').setValue(`+${this.iti?.selectedCountryData?.dialCode}`);
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }
    this.phoneNumber = this.formGroup.value.phoneNumber;
    this.phoneCountryCode = this.formGroup.value.phoneCountryCode;
    this.authService.isLoadingSubject.next(true);
    this.authService.changePhoneNumber(this.formGroup.value.phoneCountryCode, this.formGroup.value.phoneNumber).subscribe((res) => {
      if(res.state) { 
        this.isFormSubmitted = true;
        this.authService.isLoadingSubject.next(false);
      }
    });
  }

  cancel() {
    this.user = Object.assign({}, this.firstUserState);
    this.loadForm();
  }

  onCodeCompleted(code: string) {
    const forgotPasswordSubscr = this.authService
      .confirmChangePhoneNumber(this.phoneCountryCode ,this.phoneNumber, code)
      .pipe(first())
      .subscribe((result: MyResponseSingle) => {
        this.errorState = !result.state;
        if(!this.errorState) {
          this.isFormSubmitted = false;
          Swal.fire(
            'success!',
            result.messages[0],
            'success'
          );
        }
      });
    this.subscriptions.push(forgotPasswordSubscr);
  }

  resendCode() {
    if (this.phoneNumber) {
      const resendCodeSubscr = this.authService
        .changePhoneNumber(this.phoneCountryCode, this.phoneNumber)
        .pipe(first())
        .subscribe((result: MyResponseSingle) => {
          if (result.state) {
            Swal.fire(
              'success!',
              result.messages[0],
              'success'
            );
          }
        });
      this.subscriptions.push(resendCodeSubscr);
    } else {
      this.isFormSubmitted = false;
    }
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control?.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
