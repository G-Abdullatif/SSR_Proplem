import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService, MessagingService } from '../../../../../core';
import { Observable } from 'rxjs';
import { UserModel } from '../../../../../../modules/auth/index';
import { AuthService } from '../../../../../../modules/auth/_services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  private kt_quick_user_close: ElementRef;
  @ViewChild('kt_quick_user_close') set content(content: ElementRef) {
    if(content) {
        this.kt_quick_user_close = content;
      }
 }
  extrasUserOffcanvasDirection = 'offcanvas-right';
  user$: Observable<UserModel>;
  user: UserModel = new UserModel();
  profileRoute = '/user-profile';
  imageProfilePath = '';
  environment = environment;
  constructor(
    private layout: LayoutService, 
    private router: Router,
    public messagingService: MessagingService,
    private auth: AuthService
    ) {}

  ngOnInit(): void {
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.user$.subscribe(user => {
      this.user = user;
      switch (user.userType) {
        case 1:
          this.profileRoute = '/user-profile/personal-information';
          this.imageProfilePath = `${environment.apiUrl}img/Admin/natural/`;
          break;
      }
    });
  }

  openProfile() {
    this.kt_quick_user_close.nativeElement.click();
    this.router.navigateByUrl(this.profileRoute);
  }
  
    getPic() {
        const img = this.user.image;
        if (!img) {
            return 'url(./assets/media/users/blank.png)';
        }
        return `url('${img}')`;
    }
  logout() {
    this.auth.logout();
  }
}
