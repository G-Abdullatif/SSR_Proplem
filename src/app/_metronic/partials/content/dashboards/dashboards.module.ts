import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { DashboardWrapperComponent } from './dashboard-wrapper/dashboard-wrapper.component';
import { WidgetsModule } from '../widgets/widgets.module';

@NgModule({
  declarations: [Dashboard2Component, DashboardWrapperComponent],
  imports: [CommonModule, WidgetsModule],
  exports: [DashboardWrapperComponent],
})
export class DashboardsModule { }
