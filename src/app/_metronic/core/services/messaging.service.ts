import { Injectable, OnDestroy } from '@angular/core';
import firebase from "firebase/app";
import "firebase/messaging";
import { BehaviorSubject, Subscription } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { HowlerAudioService } from "../../../modules/shared/services/howler-audio.service";
import { AuthService } from 'src/app/modules/auth';
import { first } from 'rxjs/operators';
import { MyResponseSingle } from 'src/app/modules/shared/models/response';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/modules/shared/components/notification/notification.component';

const firebaseConfig = {
  apiKey: "AIzaSyDkVpPglD3sOlwew4T6chh8M2Zpf10EFwY",
  authDomain: "dratneed-4bedf.firebaseapp.com",
  databaseURL: "https://dratneed-4bedf.firebaseio.com",
  projectId: "dratneed-4bedf",
  storageBucket: "dratneed-4bedf.appspot.com",
  messagingSenderId: "199933238242",
  appId: "1:199933238242:web:513d2eb532edda722fb7bb",
  measurementId: "G-QWMM7CKGPD"
};

firebase.initializeApp(firebaseConfig);

@Injectable({
  providedIn: 'root',
})
export class MessagingService implements OnDestroy {
  durationInSeconds = 10;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  private _notification$ = new BehaviorSubject<Message>(null);
  get notification$() {
    return this._notification$.asObservable();
  }

  private _notificationsCount$ = new BehaviorSubject<number>(0);
  get notificationCount$() {
    return this._notificationsCount$.asObservable();
  }

  private _subscriptions: Subscription[] = [];
  constructor(
    private authService: AuthService,
    private afMessaging: AngularFireMessaging,
    private snackBar: MatSnackBar,
    private howlerAudioService: HowlerAudioService) {}

  requestPermission() {
    const sb = this.afMessaging.requestToken
      .subscribe(
        (token) => {
          localStorage.setItem('fcm_token',token);
          this.saveToken(token);
        },
        (error) => { console.error(error); },  
      );
      this._subscriptions.push(sb);
  }

  // used to show message when app is open
  receiveMessages() {
    const sub = this.afMessaging.messages.subscribe((message: Message) => {
      if (message.notification) {        
        this._notification$.next(message);
        this._notificationsCount$.next(this._notificationsCount$.value + 1);
        this.openSnackBar();
        this.howlerAudioService.playNotificationSound();
      }
    });
    this._subscriptions.push(sub);
  }

  // save the permission token in firestore
  private saveToken(token): void {
    const updateTokenSubscr = this.authService.updateToken(token)
      .pipe(first())
      .subscribe((result: MyResponseSingle) => {
        localStorage.setItem('fcm_token',token);
      });
    this._subscriptions.push(updateTokenSubscr);
  }

  openSnackBar() {
    this.snackBar.openFromComponent(NotificationComponent, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  disableScroll() { 
    document.body.style.overflow = 'hidden'; 
  }

  enableScroll() {
    document.body.style.overflow = 'auto';
  }

  ngOnDestroy() {
    this._subscriptions.forEach((sb) => sb.unsubscribe());
  }

}

export interface Message{
  collapse_key: string;
  data: any;
  from: string;
  notification: Notification;
  priority: string;
}

interface Notification {
  title?: string;
  body?: string;
  message?: string;
  tag?: string;
  entityType?: number;
  entityId?: number;
}