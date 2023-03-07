import { BaseModel } from "../../../_metronic/shared/crud-table";

export class PageCategory implements BaseModel {
    id: number;
    menuId: number;
    pageCategoryType: number;
    name: string;
    title: string;
    description: string;
    keyWords: string;
    metaTitle: string;
    metaDescription: string;
    content: string;
    image: string;
    mainImage: string;
    isActive: boolean;
    isDeleted: boolean;
    operatorId: number;
    userOperationType: number;
    pageCategoryTranslation: Translation[];
    mainImageFile: string;
    imageFile: string;
    constructor(userId) {
        this.operatorId = userId;
    }
}

export class Translation {
    id: number;
    pageCategoryId: number;
    languageId: number;
    title: string;
    name: string;
    content: string;
    description: string;
    keyWords: string;
    metaTitle: string;
    metaDescription: string;
    isActive: boolean;
    isDeleted: boolean;
    operatorId: number;
    userOperationType: number;
}
