import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MyResponseSingle } from '../../shared/models/response';
import { ConfirmPasswordValidator } from '../registration/confirm-password.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.scss']
})
export class CreateNewPasswordComponent implements OnInit {
  defaultAuth = {
    cPassword: '',
    password: '',
  };
  newPasswordForm: UntypedFormGroup;
  hasError: boolean;
  returnUrl: string;
  resetPasswordCode: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.resetPasswordCode = this.route.snapshot.paramMap.get('code');
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.newPasswordForm.controls;
  }

  initForm() {
    this.newPasswordForm = this.fb.group({
      cPassword: [
        this.defaultAuth.cPassword,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
    this.newPasswordForm.setValidators(ConfirmPasswordValidator.MatchPassword);
  }

  submit() {
    this.hasError = false;
    const resetSubscr = this.authService
      .resetPasswordByCode(this.resetPasswordCode, this.f.password.value)
      .pipe(first())
      .subscribe((res: MyResponseSingle) => {
        if (res.state) {
          Swal.fire(
            'success!',
            res.messages[0],
            'success'
          );
          this.router.navigate(["auth/login"]);
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(resetSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
