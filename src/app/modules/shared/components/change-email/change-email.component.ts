import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService, UserModel } from '../../../auth';
import { MyResponseSingle } from '../../models/response';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit, OnDestroy{
  formGroup: UntypedFormGroup;
  user: UserModel;
  firstUserState: UserModel;
  subscriptions: Subscription[] = [];
  isLoading$: Observable<boolean>;
  isFormSubmitted = false;
  errorState: boolean = null;
  email: string;
  constructor(
    private router: Router,
    private authService: AuthService, 
    private fb: UntypedFormBuilder) {
    this.isLoading$ = this.authService.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    const sb = this.authService.currentUserSubject.asObservable().pipe(
      first(user => !!user)
    ).subscribe(user => {
      this.user = Object.assign({}, user);
      this.firstUserState = Object.assign({}, user);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    this.formGroup = this.fb.group({
      email: [this.user.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }
    this.email = this.formGroup.value.email;
    this.authService.isLoadingSubject.next(true);
    this.authService.changeEmail(this.formGroup.value.email).subscribe((res) => {
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
      .confirmChangeEmail(this.email, code)
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
    if (this.email) {
      const resendCodeSubscr = this.authService
        .changeEmail(this.email)
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
