import { NgModule } from '@angular/core';

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
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule

} from '@angular/material';

@NgModule({
  declarations: [
  ],
  imports: [
  ],
  exports: [
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
    MatCheckboxModule,
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule
  ],
})
export class MaterialModule { }
