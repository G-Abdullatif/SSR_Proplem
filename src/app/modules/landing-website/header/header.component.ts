import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { PageService } from "../../page/services/page.service";
import { MenuService } from "../../menu/services/menu.service";
import { Menu } from "../../menu/models/menu";
import { Observable, Subscription } from "rxjs";
import { LanguagesService } from "../../languages/services/languages.service";
import { RestParams } from "../../shared/models/params";
import { TranslationService } from "../../i18n/translation.service";
import { Language } from "../../shared/models/language";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private menuService: MenuService,
    private pageService: PageService,
    private languagesService: LanguagesService,
    private translationService: TranslationService,
    private el: ElementRef,
  ) { }
  environment = environment;
  defaultImage = environment.apiUrl + "img/default.jpg";
  menuItems: Menu[] = [];
  menuItemsParendIdList: number[] = [];
  breakLoop: Menu[] = [];
  unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  languageObj = JSON.parse(localStorage.getItem("languageObj"));
  language: Language;
  languages: Language[] = [];
  ngOnInit(): void {
    this.getLanguages().subscribe((lan) => {
      localStorage.setItem("systemLanguages", JSON.stringify(lan.data));
      this.languages = lan.data;
      this.setSelectedLanguage();
      if (this.translationService.getSelectedLanguage() === undefined) {
        this.setLanguage("EN");
      }
    });

    this.getActiveMenuItems()
  }
  ngAfterViewInit() {
    // Responsive navbar toggle
    const navbarToggle = this.el.nativeElement.querySelector('.navbar-toggler');
    const meanMenu = this.el.nativeElement.querySelector('.mean-menu');
    navbarToggle.addEventListener('click', function () {
      meanMenu.classList.toggle('show');
    });

    // Close navbar when clicking outside
    this.el.nativeElement.addEventListener('click', function (event) {
      const isClickInside = meanMenu.contains(event.target as any);
      const isClickNavbarToggle = navbarToggle.contains(event.target as any);

      if (!isClickInside && !isClickNavbarToggle) {
        meanMenu.classList.remove('show');
      }
    });

    // Close navbar when scrolling
    window.addEventListener('scroll', function () {
      if (meanMenu.classList.contains('show')) {
        meanMenu.classList.remove('show');
      }
    });
  }
  ngOnDestroy() {
    this.menuService.params.pageIndex = 1;
    this.menuService.params.pageSize = 10;
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  getActiveMenuItems() {
    this.menuService.params.pageIndex = 1;
    this.menuService.params.pageSize = 1000;
    const sub = this.menuService.getIsActive().subscribe((res) => {
      this.menuItems = res.data;
      this.menuItemsParendIdList = res.data.map(function (a) {
        return a.parentId;
      });
    });
    this.unsubscribe.push(sub)
  }
  parents() {
    return this.menuItems.filter((item) => item.parentId == 0);
  }
  getPage(url) {
    this.pageService.getPage(url);
  }
  doesHaveChildren(menu) {
    return this.menuItemsParendIdList.filter((item) => item == menu.id).length;
  }
  getSubMenu(parent) {
    if (!this.breakLoop.includes(parent)) {
      this.breakLoop.push(parent);
      let ul = this.el.nativeElement.querySelector("#parent" + parent.id);
      let children = this.menuItems.filter(
        (item) => item.parentId == parent.id
      );
      for (let i = 0; i < children.length; i++) {
        let grandsons = this.menuItems.filter(
          (item) => item.parentId == children[i].id
        );
        if (grandsons.length > 0) {
          ul.insertAdjacentHTML(
            "beforeend",
            `<li class="nav-item" ><a style="cursor:pointer" id="child${children[i].id}">${children[i].name}<i class='bx bx-chevron-down'></i> </a>
                                    <ul class="dropdown-menu" style="top: 20px !important;left: 215px !important" id="parent${children[i].id}"></ul></li> `
          );
          this.getSubMenu(children[i]);
        } else {
          ul.insertAdjacentHTML(
            "beforeend",
            `<li class="nav-item" ><a style="cursor:pointer" id="child${children[i].id}">${children[i].name}</a></li>`
          );
        }
        let child = this.el.nativeElement.querySelector("#child" + children[i].id);
        child.setAttribute('routerLink', '/home/' + children[i].urlName)
        child.addEventListener("click", () =>
          this.getPage(children[i].urlName)
        );
      }
    }
  }
  setLanguageWithReload(lang) {
    this.setLanguage(lang)
    window.location.reload();

  }
  setLanguage(lang: string) {
    this.languages.forEach((language: Language) => {
      if (language.code?.toUpperCase() === lang?.toUpperCase()) {
        language.isActive = true;
        this.language = language;
      } else {
        language.isActive = false;
      }
    });
    this.translationService.setLanguage(lang, this.language?.id, this.language);
  }

  setSelectedLanguage(): any {
    this.setLanguage(this.translationService.getSelectedLanguage());
  }

  getLanguages(): Observable<Languages> {
    const param: RestParams = new RestParams(["Name"]);
      return this.languagesService.getIsActive(param);
  }

}
export class Languages {
  data: Language[];
}
