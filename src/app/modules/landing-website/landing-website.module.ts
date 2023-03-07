import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingWebsiteRoutingModule } from './landing-website-routing.module';
import { LandingWebsiteComponent } from './landing-website.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/modules/shared/shared.module';
import { TranslationModule } from '../i18n/translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExtrasModule } from '../../_metronic/partials/layout/extras/extras.module';
import { NgxWhastappButtonModule } from "ngx-whatsapp-button";
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DynamicPageComponent } from './dynamic-page/dynamic-page.component';
import { CrystalLightboxModule } from '@crystalui/angular-lightbox';
import { GalleryModule } from 'ng-gallery';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
    declarations: [
        LandingWebsiteComponent,
        HeaderComponent,
        DynamicPageComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LandingWebsiteRoutingModule,
        AutocompleteLibModule,
        ExtrasModule,
        CarouselModule,
        SharedModule,
        TranslationModule,
        CrystalLightboxModule,
        NgxWhastappButtonModule,
        NgxImageZoomModule,
        MatPaginatorModule,
        GalleryModule
    ]
})
export class LandingWebsiteModule { }
