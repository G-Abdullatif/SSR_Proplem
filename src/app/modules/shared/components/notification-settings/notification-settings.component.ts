import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService, UserModel } from '../../../auth';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss']
})
export class NotificationSettingsComponent implements OnInit {
  formGroup: UntypedFormGroup;
  user: UserModel;
  subscriptions: Subscription[] = [];
  isLoading$: Observable<boolean>;

  constructor(private authService: AuthService, private fb: UntypedFormBuilder) {
    this.isLoading$ = this.authService.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    const sb = this.authService.currentUserSubject.asObservable().pipe(
      first(user => !!user)
    ).subscribe(user => {
      this.user = Object.assign({}, user);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  loadForm() {
    this.formGroup = this.fb.group({
      isAllowNotificationByEmail: [this.user.isAllowNotificationByEmail],
      isAllowNotificationBySMS: [this.user.isAllowNotificationBySMS],
      isAllowNotificationByMobile: [this.user.isAllowNotificationByMobile],
      isAllowNotificationByWeb: [this.user.isAllowNotificationByWeb]
    });
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }
    this.authService.isLoadingSubject.next(true);
    this.authService.changeNotificationSetting(this.formGroup.value).subscribe((res) => {
      if(res.state) {
        this.authService.currentUserValue = res.data;
        this.authService.isLoadingSubject.next(false);
      }
    });
  }

  cancel() {
    this.user = Object.assign({}, this.user);
    this.loadForm();
  }

}
