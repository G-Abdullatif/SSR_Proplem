import { BaseModel } from '../../../_metronic/shared/crud-table';

export class Language implements BaseModel {
    id: number;
    name: string;
    flag: string;
    imageFile: File;
    code: string;
    sort: number;
    isRTL: boolean;
    isActive: boolean;
    isDeleted: boolean;
    isDefault: boolean;
    operatorId: number;
    userOperationType: number;
    constructor(userId) {
      this.operatorId = userId;
    }
}

