import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';

import { MaterialModule } from '../material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { ProfileComponent } from './profile/profile.component';
import { StaffPortalComponent } from './staff-portal/staff-portal.component';
import { ShiftViewComponent } from './shifts/shift-view/shift-view.component';
import { CalendarComponent } from './shifts/shift-view/calendar/calendar.component';
import { ListComponent } from './shifts/shift-view/list/list.component';

@NgModule({
  imports: [
    CommonModule,
    StaffRoutingModule,
    MaterialModule
  ],
  declarations: [
    DashboardComponent,
    ShiftsComponent,
    ProfileComponent,
    StaffPortalComponent,
    ShiftViewComponent,
    CalendarComponent,
    ListComponent
  ]
})
export class StaffModule { }
