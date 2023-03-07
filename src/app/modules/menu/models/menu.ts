export class Menu {
    id: number;
    parentId: number;
    isActive: boolean;
    isDeleted: boolean;
    operatorId: number;
    userOperationType: number;
    menuTranslation: Translation[]
    name: string;
    urlName: string;
    constructor(userId) {
        this.operatorId = userId;
    }
}
export class Translation {
    id: number;
    languageId: number;
    menuId: number ;
    name: string;
    urlName: string;
    isActive: boolean;
    isDeleted: boolean;
    operatorId: number;
    userOperationType: number;
}
