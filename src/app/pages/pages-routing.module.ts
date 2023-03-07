import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NgxPermissionsGuard } from "ngx-permissions";
import { AuthGuard } from "../modules/auth/_services/auth.guard";
import { LayoutComponent } from "./_layout/layout.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "dashboard",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "builder",
        loadChildren: () =>
          import("./builder/builder.module").then((m) => m.BuilderModule),
      },
    
      {
        path: "Menu",
        loadChildren: () =>
          import("../modules/menu/dynamic-menu.module").then(
            (m) => m.DynamicMenuModule
          ),
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'ADMIN',
            redirectTo: "/",
          },
        },
      },
      {
        path: "Page",
        loadChildren: () =>
          import("../modules/page/dynamic-page.module").then(
            (m) => m.DynamicPageModule
          ),
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'ADMIN',
            redirectTo: "/",
          },
        },
      },
      {
        path: "PageCategory",
        loadChildren: () =>
          import("../modules/page-category/page-category.module").then(
            (m) => m.PageCategoryModule
          ),
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'ADMIN',
            redirectTo: "/",
          },
        },
      },
   
      {
        path: "Languages",
        loadChildren: () =>
          import("../modules/languages/languages.module").then(
            (m) => m.LanguagesModule
          ),
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'ADMIN',
            redirectTo: "/",
          },
        },
      },
      {
        path: "Localization",
        loadChildren: () =>
          import(
            "../modules/localization-resources/localization-resources.module"
          ).then((m) => m.LocalizationResourcesModule),
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'ADMIN',
            redirectTo: "/",
          },
        },
      },
     
      {
        path: "",
        redirectTo: "/home",
        pathMatch: "full",
      },
      //{
      //  path: '**',
      //  redirectTo: 'error/404',
      //},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
