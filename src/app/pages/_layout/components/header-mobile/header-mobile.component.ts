import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LayoutService } from '../../../../_metronic/core';

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss'],
})
export class HeaderMobileComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('kt_aside_mobile_toggle', { static: false }) kt_aside_mobile_toggle: ElementRef;
  asideSelfDisplay = true;
  headerMenuSelfDisplay = true;
  headerMobileClasses = '';
  headerMobileAttributes = {};
  systemConfig = JSON.parse(localStorage.getItem("systemConfiguration"));
  private unsubscribe: Subscription[] = [];
    WebSite: string;
    logoSrc: string;

    constructor(private layout: LayoutService, private router: Router) {
     
    }

    logoSize() {
        let checkWidth = this.systemConfig.find(con => con.key == 'DashboardLogoWidth').value == '0' || this.systemConfig.find(con => con.key == 'DashboardLogoWidth').value == null || this.systemConfig.find(con => con.key == 'DashboardLogoWidth').value == undefined
        let checkHeight = this.systemConfig.find(con => con.key == 'DashboardLogoHeight').value == '0' || this.systemConfig.find(con => con.key == 'DashboardLogoHeight').value == null || this.systemConfig.find(con => con.key == 'DashboardLogoHeight').value == undefined
        if (checkWidth || checkHeight) {
            return 'width:auto;height:100%;'
        } else {
            return 'width:' + this.systemConfig.find(con => con.key == 'DashboardLogoWidth').value + 'px;' + 'height:' + this.systemConfig.find(con => con.key == 'DashboardLogoHeight').value + 'px;'
        }
    }
    ngOnInit(): void {
        try {
            this.logoSrc = environment.apiUrl + 'img/systemConfiguration/natural/' + this.systemConfig.find(con => con.key == 'DashboardLogo').value
        } catch {
            this.logoSrc = 'assets/media/logos/logo-dark-2.png'
        }
    // build view by layout config settings
      this.WebSite = localStorage.getItem("WebSite");
    this.headerMobileClasses = this.layout.getStringCSSClasses('header_mobile');
    this.headerMobileAttributes = this.layout.getHTMLAttributes(
      'header_mobile'
    );

    this.asideSelfDisplay = this.layout.getProp('aside.self.display');
    this.headerMenuSelfDisplay = this.layout.getProp(
      'header.menu.self.display'
    );
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if(document.getElementsByClassName('aside-on')[0])
          this.kt_aside_mobile_toggle.nativeElement.click();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngAfterViewInit() {
    // Init Header Topbar For Mobile Mode
    // KTLayoutHeaderTopbar.init('kt_header_mobile_topbar_toggle');
  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
