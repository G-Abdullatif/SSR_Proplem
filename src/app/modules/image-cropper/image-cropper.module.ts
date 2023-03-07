import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from './component/image-cropper.component';
import { ImageCropperModalComponent } from './image-cropper-modal/image-cropper-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatSelectModule } from '@angular/material/select';
import { TranslationModule } from '../i18n/translation.module';
import { SharedModule } from '../shared/modules/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CRUDTableModule,
        InlineSVGModule,
        MatSelectModule,
        TranslationModule,
        SharedModule,
    ],
    declarations: [
        ImageCropperComponent,
        ImageCropperModalComponent
    ],
    exports: [
        ImageCropperComponent
    ]
})
export class ImageCropperModule {}
