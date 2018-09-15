import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminDashboardComponent,
    AdminPortalComponent,
  ]
})
export class AdminModule { }
