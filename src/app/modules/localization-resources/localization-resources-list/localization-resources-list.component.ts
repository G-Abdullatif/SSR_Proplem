import { Component, OnDestroy, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import {
  ISortView,
  PaginatorState,
  SortState,
} from "src/app/_metronic/shared/crud-table";
import { LocalizationResourcesService } from "../services/localization-resources.service";
import { LocalizationResources } from "../models/localization-resources";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { CreateUpdateModalComponent } from "../create-update-modal/create-update-modal.component";
import { MyResponseList } from "../../shared/models/response";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-localization-resources-list",
  templateUrl: "./localization-resources-list.component.html",
  styleUrls: ["./localization-resources-list.component.scss"],
})
export class LocalizationResourcesListComponent
  implements OnInit, OnDestroy, ISortView
{
  constructor(
    public localizationResourcesService: LocalizationResourcesService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  searchGroup: UntypedFormGroup;

  environment = environment;
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
    this.localizationResourcesService.params.orderBy =
      sorting.direction === "asc" ? sorting.column : "-" + sorting.column;
    this.localizationResourcesService.params.pageIndex = 1;
    this.localizationResourcesService.patchState({ sorting });
  }
  paginate(paginator: PaginatorState) {
    this.localizationResourcesService.params.pageIndex = paginator.page;
    this.localizationResourcesService.params.pageSize = paginator.pageSize;
    const paginData = this.localizationResourcesService
      .getData()
      .subscribe((res: MyResponseList) => {
        this.localizationResourcesService.localizationResources =
          res.data as LocalizationResources[];
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
    this.localizationResourcesService.params.searchText = searchText;
    this.localizationResourcesService.params.pageIndex = 1;
    this.paginator.page = 1;
    const searchData = this.localizationResourcesService
      .getData()
      .subscribe((res: MyResponseList) => {
        this.paginator.total = res.totalRecord;
        this.localizationResourcesService.localizationResources = res.data;
      });
    this.subscriptions.push(searchData);
  }
  // search ends

  onActiveClicked(event, id) {
    const LocalizationResourceState = {
      id,
      isActive: event.target.checked,
    };
    const stateData = this.localizationResourcesService
      .changeIsActive(LocalizationResourceState)
      .subscribe((res: MyResponseList) => {});
    this.subscriptions.push(stateData);
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
      .then((updatedLocalizationResource: LocalizationResources) => {
        this.localizationResourcesService.updateLocalizationResources(
          updatedLocalizationResource
        );
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
      .then((updatedLocalizationResource: LocalizationResources) => {
        this.localizationResourcesService.updateLocalizationResources(
          updatedLocalizationResource
        );
      })
      .catch((err) => console.error("cancel the operation"));
  }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.localizationResourcesService.params.searchText = "";
    this.searchForm();
    // this.searchGroup.controls['searchText'].setValue('');
    const sb = this.localizationResourcesService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    this.sort("-Id");
    this.localizationResourcesService.total$.subscribe((res) => {
      this.paginator.total = res;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
