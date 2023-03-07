import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingWebsiteComponent } from './landing-website.component';
import { DynamicPageComponent } from './dynamic-page/dynamic-page.component';

const routes: Routes = [
    {
        path: '',
        component: LandingWebsiteComponent,
        children: [
            {
                path: ':page',
                component: DynamicPageComponent,
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LandingWebsiteRoutingModule { }
