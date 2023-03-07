export class Language {
    id: number;
    name: string;
    code: string;
    flag: string;
    sort: number;
    isActive: boolean;
    isDeleted: boolean;
    isRTL: boolean;
    operatorId: number;
    userOperationType: boolean;
    constructor() { 
        this.code = "EN";
    }
}
