import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { SelectOrganisationComponent } from './login/select-organisation/select-organisation.component';
import { SelectPortalComponent } from './login/select-portal/select-portal.component';
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
    SelectOrganisationComponent,
    SelectPortalComponent,
    MenuComponent
  ],
  entryComponents: [
    ForgotPasswordComponent,
    SelectOrganisationComponent,
    SelectPortalComponent
  ],
  exports: [
    MenuComponent,
  ]
})
export class CoreModule { }
