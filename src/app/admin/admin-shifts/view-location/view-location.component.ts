import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatBottomSheetRef, MatBottomSheet, MatSort, MatDialog, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { ShiftService, ShiftLocation } from '../../../_services/shift/shift.service';
import { CreateUpdateLocationComponent } from '../create-update-location/create-update-location.component';
import { ConfirmationComponent } from '../../../shared/components/confirmation/confirmation.component';

@Component({
  selector: 'app-view-location',
  templateUrl: './view-location.component.html',
  styleUrls: ['./view-location.component.scss']
})
export class ViewLocationComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<ShiftLocation>();
  columnsToDisplay = ['description', 'address'];
  isLoading = true;

  constructor(private shiftService: ShiftService, private bottomSheet: MatBottomSheet, private dialog: MatDialog) {
    this.shiftService.getShiftLocations().subscribe((locations: ShiftLocation[]) => {
      this.dataSource.data = locations;
      this.isLoading = false;
    });
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  openBottomSheet(location: ShiftLocation): void {
    this.bottomSheet.open(ShiftLocationSheetComponent, {
      data: location
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
