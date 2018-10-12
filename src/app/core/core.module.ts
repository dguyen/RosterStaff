import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    MenuComponent
  ],
  entryComponents: [
    ForgotPasswordComponent
  ],
  exports: [
    MenuComponent,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CoreModule { }
