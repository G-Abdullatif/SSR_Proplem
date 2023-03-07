import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '..';
import { MyResponseSingle } from '../../shared/models/response';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit, OnDestroy {
    errorState: boolean = null;
    healthFacilityName = localStorage.getItem("healthFacilityName") || '';

    constructor(private authService: AuthService, private router: Router) {
        setTimeout(() => {
            this.healthFacilityName = localStorage.getItem("healthFacilityName") || ''
        }, 1000)
    }
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  ngOnInit(): void {
  }

  // this called only if user entered full code
  onCodeCompleted(code: string) {
    const forgotPasswordSubscr = this.authService
      .verifyResetCode(code)
      .pipe(first())
      .subscribe((result: MyResponseSingle) => {
        this.errorState = !result.state;
        if(!this.errorState)
            this.router.navigate(['/' + this.healthFacilityName +'/auth/create-new-password', code]);
      });
    this.unsubscribe.push(forgotPasswordSubscr);
  }

  resendCode() {
    if (this.authService.emailOrPhoneNumber) {
      const forgotPasswordSubscr = this.authService
        .forgotPassword(this.authService.emailOrPhoneNumber, this.authService.resetBy)
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
      this.unsubscribe.push(forgotPasswordSubscr);
    } else {
        this.router.navigate(['/' + this.healthFacilityName +'/auth/forgot-password'])
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
