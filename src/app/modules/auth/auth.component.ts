import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PrivacyPolicyComponent } from '../shared/components/privacy-policy/privacy-policy.component';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

    today: Date = new Date();
    subscription: Subscription;
    WebSite: string;
    systemConfig = JSON.parse(localStorage.getItem("systemConfiguration"));
    logoSrc: string;
    constructor(public dialog: MatDialog,
        private translate: TranslateService,
        private router: Router) {
        //if (this.router.url.split("/")[1] == "auth") {
        //    localStorage.removeItem("healthFacilityName")
        //    localStorage.removeItem("healthFacilityId")
        //}
    }
    logoSize() {
        try {
            let checkWidth = this.systemConfig.find(con => con.key == 'LogoWidth').value == '0' || this.systemConfig.find(con => con.key == 'LogoWidth').value == null || this.systemConfig.find(con => con.key == 'LogoWidth').value == undefined
            let checkHeight = this.systemConfig.find(con => con.key == 'LogoHeight').value == '0' || this.systemConfig.find(con => con.key == 'LogoHeight').value == null || this.systemConfig.find(con => con.key == 'LogoHeight').value == undefined
            if (checkWidth || checkHeight) {
                return 'width:auto;height:100%;'
            } else {
                return 'width:' + this.systemConfig.find(con => con.key == 'LogoWidth').value + 'px;' + 'height:' + this.systemConfig.find(con => con.key == 'LogoHeight').value + 'px;'
            }
        } catch { }
    }
    leftSideBg() {
        try {
            return 'background:' + this.systemConfig.find(con => con.key == 'SignInColor').value
        } catch {
            return 'background:#c8f4ff'
        }
    }
    leftSideImage() {
        try {
            return 'background-image:url(' + environment.apiUrl + 'img/systemConfiguration/natural/' + this.systemConfig.find(con => con.key == 'SignInImage').value + ')'
        } catch {
            return 'background-image:url(assets/img/search-bg.png)'
        }
    }
    ngOnInit(): void {
        try {
            this.logoSrc = environment.apiUrl + 'img/systemConfiguration/natural/' + this.systemConfig.find(con => con.key == 'Logo').value
        } catch {
            this.logoSrc = 'assets/media/logos/logo-dark-2.png'
        }
        this.WebSite = localStorage.getItem("WebSite");
        this.subscription = this.translate.getTranslation(this.translate.currentLang).subscribe();
    }
    openDialog() {
        this.dialog.open(PrivacyPolicyComponent);
    }
   
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
