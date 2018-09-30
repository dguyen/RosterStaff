import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';

import { StaffRoutingModule } from './staff-routing.module';
import { SharedModule } from '../shared/shared.module';

import { StaffDashboardComponent } from './staff-dashboard/staff-dashboard.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { StaffProfileComponent } from './staff-profile/staff-profile.component';
import { ShiftViewComponent } from './shifts/shift-view/shift-view.component';
import { CalendarComponent } from './shifts/shift-view/calendar/calendar.component';
import { ListComponent } from './shifts/shift-view/list/list.component';
import { StaffPortalComponent } from './staff-portal/staff-portal.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    StaffRoutingModule,
  ],
  declarations: [
    StaffDashboardComponent,
    ShiftsComponent,
    StaffProfileComponent,
    StaffPortalComponent,
    ShiftViewComponent,
    CalendarComponent,
    ListComponent
  ]
})
export class StaffModule { }
