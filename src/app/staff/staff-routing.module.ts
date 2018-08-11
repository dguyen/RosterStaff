import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { AuthGuard } from '../_guards/auth-guard.service';

const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    canActivate: [ AuthGuard ],
    canActivateChild: [ AuthGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
