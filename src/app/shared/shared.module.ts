import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    ConfirmationComponent
  ],
  entryComponents: [ConfirmationComponent]
})
export class SharedModule { }
