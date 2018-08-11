import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';

import { AuthGuard } from './_guards/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: HomeComponent,
    canActivate: [ AuthGuard ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule {}