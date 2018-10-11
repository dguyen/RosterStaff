import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { TableListComponent } from './components/table-list/table-list.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ConfirmationComponent,
    ResetPasswordComponent,
    TableListComponent
  ],
  exports: [
    ResetPasswordComponent,
    TableListComponent
  ],
  entryComponents: [ConfirmationComponent]
})
export class SharedModule { }
