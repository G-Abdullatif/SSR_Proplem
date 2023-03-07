import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./modules/auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'home',
        loadChildren: () =>
            import('./modules/landing-website/landing-website.module').then((m) => m.LandingWebsiteModule),
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: '',
        loadChildren: () =>
            import('./pages/layout.module').then((m) => m.LayoutModule),
    },
    {
        path: '**',
        redirectTo: 'error/404'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledNonBlocking'
})],
    exports: [RouterModule],
})
export class AppRoutingModule { }
