import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguagesComponent } from './languages.component';
import { RouterModule, Routes } from '@angular/router';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { InlineSVGModule } from 'ng-inline-svg';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguagesListComponent } from "./languages-list/languages-list.component";
import { CreateUpdateModalComponent } from "./create-update-modal/create-update-modal.component";
import { SharedModule } from '../shared/modules/shared/shared.module';
import { TranslationModule } from '../i18n/translation.module';

const routes: Routes = [
  {
    path: "",
    component: LanguagesListComponent,
    children: []
  }
];


@NgModule({
  declarations: [LanguagesComponent, LanguagesListComponent, CreateUpdateModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CRUDTableModule,
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    TranslationModule,
    SharedModule
  ]
})
export class LanguagesModule { }
