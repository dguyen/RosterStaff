import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { AdminStaffComponent } from './admin-staff/admin-staff.component';
import { AdminShiftsComponent } from './admin-shifts/admin-shifts.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { AddShiftComponent } from './admin-shifts/add-shift/add-shift.component';
import { AddStaffComponent } from './admin-staff/add-staff/add-staff.component';
import { CreateUpdateLocationComponent } from './admin-shifts/create-update-location/create-update-location.component';
import { ViewLocationComponent, ShiftLocationSheetComponent } from './admin-shifts/view-location/view-location.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminDashboardComponent,
    AdminPortalComponent,
    AdminStaffComponent,
    AdminShiftsComponent,
    AdminProfileComponent,
    AddShiftComponent,
    AddStaffComponent,
    CreateUpdateLocationComponent,
    ShiftLocationSheetComponent,
    ViewLocationComponent,
  ],
  entryComponents: [
    CreateUpdateLocationComponent,
    ShiftLocationSheetComponent
  ]
})
export class AdminModule { }
