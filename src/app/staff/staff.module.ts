import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';

import { MaterialModule } from '../material.module';
import { TabMenuComponent } from './tab-menu/tab-menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { ProfileComponent } from './profile/profile.component';
import { StaffPortalComponent } from './staff-portal/staff-portal.component';

@NgModule({
  imports: [
    CommonModule,
    StaffRoutingModule,
    MaterialModule
  ],
  declarations: [
    TabMenuComponent,
    DashboardComponent,
    ShiftsComponent,
    ProfileComponent,
    StaffPortalComponent
  ]
})
export class StaffModule { }
