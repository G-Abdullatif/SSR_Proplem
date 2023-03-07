import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Page } from "../../page/models/page";
import { PageService } from "../../page/services/page.service";
import { DomSanitizer, Meta, SafeHtml } from "@angular/platform-browser";
import { UrlRoutingService } from "../../shared/services/url-routing.service";
@Component({
    selector: "app-dynamic-page",
    templateUrl: "./dynamic-page.component.html",
    styleUrls: ["./dynamic-page.component.scss"],
})
export class DynamicPageComponent implements OnInit, OnDestroy {
  environment = environment;
  defaultImage = environment.apiUrl + "img/default.jpg";
    constructor(
        public pageService: PageService,
        public urlRoutingService: UrlRoutingService,
        private router: Router,
        private meta: Meta,
        private sanitizer: DomSanitizer
    ) { }
    page: Page;
    content: SafeHtml;
    subscriptions: Subscription[] = [];
    isLoading$: Observable<boolean>;
    ngOnInit(): void {
        this.isLoading$ = this.pageService.isDataLoaded$.asObservable();
        const sub = this.isLoading$.subscribe((isLoading) => {
            if (!isLoading) {
                this.getPage();
            }
        });
        this.subscriptions.push(sub);
    }
    setMeta(data) {
        this.meta.updateTag({
            name: 'description',
            content: data.metaDescription
        });
        this.meta.updateTag({
            name: 'title',
            content: data.metaTitle
        });
    }
    getPage(url?) {
        const name = window.location.href.split("/");
        let urlName = url != null ? url : name[4]
        this.urlRoutingService
            .getPageByURLName(urlName)
            .subscribe((res) => {
                if (res.data) {
                    if (res.data.entityType == 2)
                        this.getPagesByCategoryId(res.data.id);
                    this.page = res.data;
                    this.setMeta(this.page)
                   this.content = this.sanitizer.bypassSecurityTrustHtml(
                        this.page.content
                    );
                 } else this.router.navigate(["/home"]);
            });
    }

    getPagesByCategoryId(Id) {
        const sub = this.pageService.getPageByCategoryId(Id).subscribe(res => {
            this.pageService.pages = res.data
        });
        this.subscriptions.push(sub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
