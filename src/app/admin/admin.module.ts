import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { AdminStaffComponent } from './admin-staff/admin-staff.component';
import { AdminShiftsComponent } from './admin-shifts/admin-shifts.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { AddShiftComponent } from './admin-shifts/add-shift/add-shift.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminDashboardComponent,
    AdminPortalComponent,
    AdminStaffComponent,
    AdminShiftsComponent,
    AdminProfileComponent,
    AddShiftComponent,
  ]
})
export class AdminModule { }
