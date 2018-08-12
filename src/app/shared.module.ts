import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular material components
import { 
    MatProgressSpinnerModule,
    MatButtonModule, 
    MatCardModule, 
    MatMenuModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatAutocompleteModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatCheckboxModule,
} from '@angular/material';


@NgModule({
  declarations: [
  ],
  imports: [
  ],
  exports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,

    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule
  ],
})
export class SharedModule { }
