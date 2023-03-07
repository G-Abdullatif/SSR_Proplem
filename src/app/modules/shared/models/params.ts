
export class RestParams{
    pageIndex: number;
    pageSize: number;
    orderBy: string;
    sku: string;
    searchBy: string[];
    searchText: string;
    viewInHome: boolean;
    notificationType?: number;
    definitionType?: number;
    startDate?: string;
    endDate?: string;
    constructor(searchBy: string[]) {
        this.pageIndex = 1;
        this.pageSize = 10;
        this.orderBy = '-Id';
        this.searchText = '';
        this.searchBy = searchBy;
        this.notificationType = 1;
        this.viewInHome = false;
        this.sku = '';
    }
}
