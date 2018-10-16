import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MatBottomSheet, MatDialog, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { ShiftService, ShiftLocation } from '../../_services/shift/shift.service';
import { ConfirmationComponent } from '../../shared/components/confirmation/confirmation.component';
import { CreateUpdateLocationComponent } from './create-update-location/create-update-location.component';

@Component({
  selector: 'app-admin-location',
  templateUrl: './admin-location.component.html',
  styleUrls: ['./admin-location.component.scss']
})
export class AdminLocationComponent implements OnInit {
  columnsToDisplay = ['description', 'address'];
  prettifiedColumns = {
    description: 'Description',
    address: 'Address'
  };
  locationStream: any;

  constructor(private shiftService: ShiftService, private bottomSheet: MatBottomSheet, private dialog: MatDialog) {
    this.locationStream = this.shiftService.getShiftLocations();
  }

  ngOnInit() {}

  openBottomSheet(location: ShiftLocation): void {
    this.bottomSheet.open(ShiftLocationSheetComponent, {
      data: location
    });
  }

  addLocation() {
    this.dialog.open(CreateUpdateLocationComponent, {
      width: '50%',
      data: { type: 'add' }
    });
  }
}

@Component({
  selector: 'app-location-sheet',
  template: `
  <mat-nav-list>
    <a mat-list-item (click)="editLocation()">
      <mat-icon>edit</mat-icon>
      <span mat-line>Update Shift Location</span>
    </a>
    <a mat-list-item (click)="deleteLocation()">
      <mat-icon>delete</mat-icon>
      <span mat-line>Delete Shift Location</span>
    </a>
  </mat-nav-list>`
})
export class ShiftLocationSheetComponent {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public location: any,
    private bottomSheetRef: MatBottomSheetRef<ShiftLocationSheetComponent>,
    private dialog: MatDialog,
    private shiftService: ShiftService
  ) {
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  editLocation() {
    this.dialog.open(CreateUpdateLocationComponent, {
      width: '50%',
      data: {
        type: 'edit',
        location: this.location
      }
    });
    this.bottomSheetRef.dismiss();
  }

  deleteLocation() {
    const confirmDialog = this.dialog.open(ConfirmationComponent, {
      data: { message: 'Are you sure you want to delete the (' + this.location.description + ') location?' }
    });

    confirmDialog.afterClosed().subscribe((data) => {
      if (data) {
        this.shiftService.removeShiftLocation(this.location.uid);
      }
      this.bottomSheetRef.dismiss();
    });
  }
}
