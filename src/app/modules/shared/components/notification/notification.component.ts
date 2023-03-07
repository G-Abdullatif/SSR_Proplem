import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagingService } from 'src/app/_metronic/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy{
  notification: Notification;
  private subscriptions: Subscription[] = [];
  defaultImage = './assets/media/users/blank.png';
  constructor(private messagingService: MessagingService) { }

  ngOnInit(): void {
    const notificationSub = this.messagingService.notification$.subscribe(message => {
      if(message)
        this.notification = message?.notification;
    });
    this.subscriptions.push(notificationSub);
  }


  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
export interface Notification {
  title?: string;
  body?: string;
  message?: string;
  tag?: string;
  click_action?: string;
}