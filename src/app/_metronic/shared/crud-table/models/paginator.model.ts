export const PageSizes = [3, 5, 10, 15, 50, 100];

export interface IPaginatorState {
  page: number;
  pageSize: number;
  total: number;
  recalculatePaginator(total: number): IPaginatorState;
}

export class PaginatorState implements IPaginatorState {
  page: number;
  pageSize: number;
  total: number;
  pageSizes: number[];

  constructor() {
    this.page = 1;
    this.pageSize = PageSizes[2];
    this.total = 0;
    this.pageSizes = PageSizes;
  }
  recalculatePaginator(total: number): PaginatorState {
    this.total = total;
    return this;
  }
}

export interface IPaginatorView {
  paginator: PaginatorState;
  ngOnInit(): void;
  paginate(paginator: PaginatorState): void;
}
