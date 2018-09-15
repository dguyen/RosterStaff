import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';

import { MaterialModule } from '../material.module';
import { StaffRoutingModule } from './staff-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { ProfileComponent } from './profile/profile.component';
import { ShiftViewComponent } from './shifts/shift-view/shift-view.component';
import { CalendarComponent } from './shifts/shift-view/calendar/calendar.component';
import { ListComponent } from './shifts/shift-view/list/list.component';
import { StaffPortalComponent } from './staff-portal/staff-portal.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
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
