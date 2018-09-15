import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './core/login/login.component';

const routes: Routes = [
  {
    path: 'staff',
    loadChildren: './staff/staff.module#StaffModule'
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule'
  },
  {
    path: '',
    component: LoginComponent
  },
  { path: '**', redirectTo: '' } // Todo: Replace with 'page not found' component
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule {}
