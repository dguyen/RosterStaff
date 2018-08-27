import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from '../_guards/auth.guard';
import { RoleGuard } from '../_guards/role.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard, RoleGuard ],
    canActivateChild: [ AuthGuard, RoleGuard ],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
