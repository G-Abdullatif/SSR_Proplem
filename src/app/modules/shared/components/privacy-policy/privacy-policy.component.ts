import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SystemService } from '../../services/system.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy{
  PrivacyPolicy = '';
  subscription : Subscription;
  constructor(private systemService: SystemService) { }

  ngOnInit(): void {
    this.subscription = this.systemService.getPrivacyPolicy().subscribe(res => {
      this.PrivacyPolicy = res.data;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
