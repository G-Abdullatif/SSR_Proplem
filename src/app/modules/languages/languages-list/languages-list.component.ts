import { Component, OnDestroy, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import {
  ISortView,
  PaginatorState,
  SortState,
} from "src/app/_metronic/shared/crud-table";
import { LanguagesService } from "../services/languages.service";
import { Language } from "../models/languages";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { CreateUpdateModalComponent } from "../create-update-modal/create-update-modal.component";
import { MyResponseList } from "../../shared/models/response";
import { environment } from "../../../../environments/environment";
import Swal from "sweetalert2";
const USERDATA_DATA = `${environment.appVersion}-${environment.USERDATA_KEY}`;

@Component({
  selector: "app-languages-list",
  templateUrl: "./languages-list.component.html",
  styleUrls: ["./languages-list.component.scss"],
})
export class LanguagesListComponent implements OnInit, OnDestroy, ISortView {
  constructor(
    public languagesService: LanguagesService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  searchGroup: UntypedFormGroup;
  languages = this.languagesService.languages as any;
  languageObj = JSON.parse(localStorage.getItem("languageObj"));

  // sorting starts
  sorting: SortState = new SortState();
  // sorting ends

  // pagination starts
  paginator: PaginatorState = new PaginatorState();
  sort(column: string): void {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = "asc";
    } else {
      sorting.direction = sorting.direction === "asc" ? "desc" : "asc";
    }
    this.languagesService.params.orderBy =
      sorting.direction === "asc" ? sorting.column : "-" + sorting.column;
    this.languagesService.params.pageIndex = 1;
    this.languagesService.patchState({ sorting });
  }
  paginate(paginator: PaginatorState) {
    this.languagesService.params.pageIndex = paginator.page;
    this.languagesService.params.pageSize = paginator.pageSize;
    const paginData = this.languagesService
      .getData()
      .subscribe((res: MyResponseList) => {
        this.languagesService.languages = res.data as Language[];
      });
    this.subscriptions.push(paginData);
  }
  // pagination ends

  // search starts
  searchForm() {
    // +
    this.searchGroup = this.fb.group({
      searchText: [""],
    });
    const searchEvent = this.searchGroup.controls.searchText.valueChanges
      .pipe(
        /*
                The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
                we are limiting the amount of server requests emitted to a maximum of one every 150ms
                */
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => {
        this.search(val);
      });
    this.subscriptions.push(searchEvent);
  }
  search(searchText: string) {
    // +
    this.languagesService.params.searchText = searchText;
    this.languagesService.params.pageIndex = 1;
    this.paginator.page = 1;
    const searchData = this.languagesService
      .getData()
      .subscribe((res: MyResponseList) => {
        this.paginator.total = res.totalRecord;
        this.languagesService.languages = res.data;
      });
    this.subscriptions.push(searchData);
  }
  // search ends
  onDefaultClicked(language: Language) {
    language.id = language.id;
    language.operatorId = JSON.parse(localStorage.getItem(USERDATA_DATA)).id;
    const index2 = this.languages.findIndex((c) => c.id === language.id);
    for (let i = 0; i < this.languages.length; i++) {
      this.languages[i].isDefault = false;
    }
    this.languages[index2].isDefault = true;
    localStorage.setItem("systemLanguages", JSON.stringify(this.languages));
    const stateData = this.languagesService
      .createOrUpdateLanguage(language)
      .subscribe((res: MyResponseList) => {});
    this.subscriptions.push(stateData);
  }
  onActiveClicked(language: Language) {
    if (language.id != this.languageObj.id) {
      language.id = language.id;
      language.isActive = !language.isActive;
      language.operatorId = JSON.parse(localStorage.getItem(USERDATA_DATA)).id;

      const index2 = this.languages.findIndex((c) => c.id === language.id);
      if (index2 == -1) {
        this.languages.push(language);
      } else {
        if (!language.isActive) {
          this.languages = this.languages.filter(
            (item) => item.id != this.languages[index2].id
          );
        }
      }
      localStorage.setItem("systemLanguages", JSON.stringify(this.languages));
      const stateData = this.languagesService
        .createOrUpdateLanguage(language)
        .subscribe((res: MyResponseList) => {});
      this.subscriptions.push(stateData);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Something went wrong!",
        text: "You can't change the current language status",
      });
    }
  }
  onChangeLanguage() {
    const selectData = this.languagesService
      .getData()
      .subscribe((res: MyResponseList) => {
        this.languagesService.languages = res.data as Language[];
      });
    this.subscriptions.push(selectData);
  }
  // form actions
  create() {
    const modalRef = this.modalService.open(CreateUpdateModalComponent, {
      size: "xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    modalRef.result
      .then((updatedLanguage: Language) => {
        this.languagesService.updateLanguages(updatedLanguage);
      })
      .catch((err) => console.error("cancel the operation"));
  }
  edit(id: number) {
    const modalRef = this.modalService.open(CreateUpdateModalComponent, {
      size: "xl",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    modalRef.componentInstance.id = id;
    modalRef.result
      .then((updatedLanguage: Language) => {
        this.languagesService.updateLanguages(updatedLanguage);
      })
      .catch((err) => console.error("cancel the operation"));
  }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.languages = this.languagesService.languages as any;
    setTimeout((res) => {
      this.languages = this.languagesService.languages.filter(
        (item) => item.isActive == true
      ) as any;
    }, 1000);
    this.languagesService.params.searchText = "";
    this.searchForm();
    // this.searchGroup.controls['searchText'].setValue('');
    const sb = this.languagesService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    this.sort("-Id");
    this.languagesService.total$.subscribe((res) => {
      this.paginator.total = res;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
