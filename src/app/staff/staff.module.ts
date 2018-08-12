import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';

import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    StaffRoutingModule,
    MaterialModule
  ],
  declarations: [HomeComponent, NavigationComponent]
})
export class StaffModule { }
