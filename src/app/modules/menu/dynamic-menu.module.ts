import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { InlineSVGModule } from 'ng-inline-svg';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from '../i18n/translation.module';
import { SharedModule } from '../shared/modules/shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { DynamicMenuComponent } from './dynamic-menu.component';

const routes: Routes = [
    {
        path: "",
        children: []
    }
];

@NgModule({
    declarations: [DynamicMenuComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CRUDTableModule,
        MatSelectModule,
        InlineSVGModule,
        TranslationModule,
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class DynamicMenuModule { }
