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
import { CreateUpdateLocationComponent } from './admin-location/create-update-location/create-update-location.component';
import { AdminLocationComponent, ShiftLocationSheetComponent } from './admin-location/admin-location.component';
import { ViewShiftComponent, ShiftSheetComponent } from './admin-shifts/view-shift/view-shift.component';

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
    AdminLocationComponent,
    AddShiftComponent,
    AddStaffComponent,
    CreateUpdateLocationComponent,
    ShiftLocationSheetComponent,
    ViewShiftComponent,
    ShiftSheetComponent
  ],
  entryComponents: [
    CreateUpdateLocationComponent,
    ShiftLocationSheetComponent,
    ShiftSheetComponent
  ]
})
export class AdminModule { }
