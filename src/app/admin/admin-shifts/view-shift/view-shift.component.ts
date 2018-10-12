import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MatBottomSheet, MatDialog, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { ShiftService } from '../../../_services/shift/shift.service';
import { ConfirmationComponent } from '../../../shared/components/confirmation/confirmation.component';
import { Shift } from '../../../_services/shift/shift';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-view-shift',
  templateUrl: './view-shift.component.html',
  styleUrls: ['./view-shift.component.scss']
})
export class ViewShiftComponent implements OnInit {
  columnsToDisplay = ['location', 'date', 'start', 'end'];
  prettifiedColumns = {
    'location': 'Location',
    'date': 'Date',
    'start': 'Start Time',
    'end': 'End Time'
  };
  shiftStream: BehaviorSubject<Shift[]>;

  constructor(private shiftService: ShiftService, private bottomSheet: MatBottomSheet, private dialog: MatDialog) {
    this.shiftStream = this.shiftService.shiftStream;
  }

  ngOnInit() {}

  openBottomSheet(shift: Shift) {
    this.bottomSheet.open(ShiftSheetComponent, {
      data: shift
    });
  }

  addShift() {
    // Todo: Swipe Mat-tab to add shift component
  }
}

@Component({
  selector: 'app-shift-sheet',
  template: `
  <mat-nav-list>
    <a mat-list-item (click)="showMoreDetails()">
      <mat-icon>poll</mat-icon>
      <span mat-line>Show Full Shift Details</span>
    </a>
    <a mat-list-item (click)="viewStaff()">
      <mat-icon>people</mat-icon>
      <span mat-line>View Rostered Staff</span>
    </a>
    <a mat-list-item (click)="editShift()">
      <mat-icon>edit</mat-icon>
      <span mat-line>Update Shift</span>
    </a>
    <a mat-list-item (click)="deleteShift()">
      <mat-icon>delete</mat-icon>
      <span mat-line>Delete Shift</span>
    </a>
  </mat-nav-list>`
})
export class ShiftSheetComponent {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public shift: Shift,
    private bottomSheetRef: MatBottomSheetRef<ShiftSheetComponent>,
    private dialog: MatDialog,
    private shiftService: ShiftService
  ) {
  }

  showMoreDetails() {
    // Todo
    this.bottomSheetRef.dismiss();
  }

  viewStaff() {
    // Todo
    this.bottomSheetRef.dismiss();
  }

  editShift() {
    // Todo
    this.bottomSheetRef.dismiss();
  }

  deleteShift() {
    const confirmDialog = this.dialog.open(ConfirmationComponent, {
      data: { message: 'Are you sure you want to delete the shift at (' + this.shift.location.description + ') on (' + 'Todo_date' + ')?' }
    });

    confirmDialog.afterClosed().subscribe((data) => {
      if (data) {
        this.shiftService.deleteShift(this.shift);
      }
      this.bottomSheetRef.dismiss();
    });
  }
}
