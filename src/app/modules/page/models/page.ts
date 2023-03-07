import { SafeHtml } from "@angular/platform-browser";
import { BaseModel } from "../../../_metronic/shared/crud-table";

export class Page implements BaseModel {
    id: number;
    menuId: number;
    pageCategoryId: number;
    pageType: number;
    name: string;
    title: string;
    description: string;
    shortDescription: string;
    metaTitle: string;
    keyWords: string;
    metaDescription: string;
    content: string;
    image: string;
    mainImage: string;
    icon: string;
    isViewUp: boolean;
    isViewDown: boolean;
    isActive: boolean;
    isDeleted: boolean;
    operatorId: number;
    userOperationType: number;
    pageTranslation: Translation[];
    mainImageFile: string;
    imageFile: string;
    iconFile: string;
    entityType: number;
    constructor(userId) {
        this.operatorId = userId;
    }
}

export class Translation {
    id: number;
    pageId: number;
    languageId: number;
    title: string;
    name: string;
    content: string;
    description: string;
    shortDescription: string;
    metaTitle: string;
    keyWords: string;
    metaDescription: string;
    isActive: boolean;
    isDeleted: boolean;
    operatorId: number;
    userOperationType: number;
}
