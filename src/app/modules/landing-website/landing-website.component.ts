import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth';

@Component({
    selector: 'app-landing-website',
    templateUrl: './landing-website.component.html',
    styleUrls: ['./landing-website.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class LandingWebsiteComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    systemConfig = JSON.parse(localStorage.getItem("systemConfiguration"));

    constructor(public translate: TranslateService, private authService: AuthService,) {
        try {
            document.documentElement.style.setProperty("--primary-color", this.systemConfig.find(con => con.key == 'PrimaryColor').value)
        } catch { document.documentElement.style.setProperty("--primary-color", "#25b0ac") }
        try {
            document.documentElement.style.setProperty("--secondary-color", this.systemConfig.find(con => con.key == 'SecondaryColor').value)
        } catch { document.documentElement.style.setProperty("--secondary-color", "#ee95b6") }
        try {
            document.documentElement.style.setProperty("--buttons-color", this.systemConfig.find(con => con.key == 'ButtonsColor').value)

        } catch { document.documentElement.style.setProperty("--buttons-color", "#20c0f3") }
        try {
            document.documentElement.style.setProperty("--buttons-hover-color", this.systemConfig.find(con => con.key == 'ButtonsHoverColor').value)
        } catch { document.documentElement.style.setProperty("--buttons-hover-color", "#02baf5") }
        try {
            document.documentElement.style.setProperty("--mobile-menu-color", this.systemConfig.find(con => con.key == 'MobileMenuColor').value)
        } catch { document.documentElement.style.setProperty("--mobile-menu-color", "#25b0ac") }
    }
    public phone = ""
    public title = "";

    ngOnInit(): void {
        this.subscription = this.translate.getTranslation(this.translate.currentLang).subscribe();
        this.phone=this.systemConfig.find(con => con.key == 'WhatsApp_Number').value;
    }


    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
