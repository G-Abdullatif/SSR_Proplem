import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LocalizationResourcesComponent } from './localization-resources.component';
import { LocalizationResourcesListComponent } from './localization-resources-list/localization-resources-list.component';
import { CreateUpdateModalComponent } from './create-update-modal/create-update-modal.component';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { InlineSVGModule } from 'ng-inline-svg';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from '../i18n/translation.module';
import { SharedModule } from '../shared/modules/shared/shared.module';

const routes: Routes = [
  {
    path: "",
    component: LocalizationResourcesListComponent,
    children: []
  }
];

@NgModule({
  declarations: [LocalizationResourcesComponent, LocalizationResourcesListComponent, CreateUpdateModalComponent],
  imports: [
    CommonModule,
    CommonModule,
    CRUDTableModule,
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    TranslationModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class LocalizationResourcesModule { }
