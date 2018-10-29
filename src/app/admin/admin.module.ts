import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { AdminStaffComponent } from './admin-staff/admin-staff.component';
import { AdminShiftsComponent } from './admin-shifts/admin-shifts.component';
import { CreateUpdateLocationComponent } from './admin-location/create-update-location/create-update-location.component';
import { AdminLocationComponent, ShiftLocationSheetComponent } from './admin-location/admin-location.component';
import { ViewShiftComponent, ShiftSheetComponent } from './admin-shifts/view-shift/view-shift.component';
import { AddUpdateViewShiftComponent } from './admin-shifts/add-update-view-shift/add-update-view-shift.component';
import { RosterStaffTableComponent } from './admin-shifts/roster-staff-table/roster-staff-table.component';
import { ViewStaffComponent, StaffSheetComponent } from './admin-staff/view-staff/view-staff.component';
import { AddUpdateViewStaffComponent } from './admin-staff/add-update-view-staff/add-update-view-staff.component';

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
    AdminLocationComponent,
    CreateUpdateLocationComponent,
    ShiftLocationSheetComponent,
    ViewShiftComponent,
    ShiftSheetComponent,
    AddUpdateViewShiftComponent,
    RosterStaffTableComponent,
    StaffSheetComponent,
    ViewStaffComponent,
    AddUpdateViewStaffComponent
  ],
  entryComponents: [
    CreateUpdateLocationComponent,
    ShiftLocationSheetComponent,
    ShiftSheetComponent,
    StaffSheetComponent
  ]
})
export class AdminModule { }
