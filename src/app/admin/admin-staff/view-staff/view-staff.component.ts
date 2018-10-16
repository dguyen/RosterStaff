import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatDialog } from '@angular/material';
import { ConfirmationComponent } from 'src/app/shared/components/confirmation/confirmation.component';
import { StaffService } from 'src/app/_services/staff/staff.service';
import { Staff } from 'src/app/_services/staff/staff';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-staff',
  templateUrl: './view-staff.component.html',
  styleUrls: ['./view-staff.component.scss']
})
export class ViewStaffComponent implements OnInit {
  @Output() changeTab = new EventEmitter<any>();
  staffStream: Observable<{}[]>;
  columnsToDisplay = ['firstName', 'lastName', 'email', 'phoneNum'];
  prettifiedColumns = {
    firstName: 'First Name',
    lastName: 'Last name',
    email: 'Email',
    phoneNum: 'Phone Number'
  };

  constructor(private staffService: StaffService, private bottomSheet: MatBottomSheet) {
    this.staffStream = this.staffService.staffStream;
  }

  ngOnInit() {}

  openBottomSheet(staff: Staff) {
    this.bottomSheet.open(StaffSheetComponent, {
      data: staff
    }).afterDismissed().subscribe((data) => {
      if (data && data['action']) {
        this.changeTab.emit({
          type: data.action,
          staff: staff
        });
      }
    });
  }

  addStaff() {
    this.changeTab.emit({
      type: 'add',
      staff: null
    });
  }
}

@Component({
  selector: 'app-staff-sheet',
  template: `
  <mat-nav-list>
    <a mat-list-item (click)="showMoreDetails()">
      <mat-icon>poll</mat-icon>
      <span mat-line>Show Full Staff Details</span>
    </a>
    <a mat-list-item (click)="editStaff()">
      <mat-icon>edit</mat-icon>
      <span mat-line>Update Staff Member</span>
    </a>
    <a mat-list-item (click)="deleteStaff()">
      <mat-icon>delete</mat-icon>
      <span mat-line>Delete Staff Member</span>
    </a>
  </mat-nav-list>`
})
export class StaffSheetComponent {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public staff: Staff,
    private bottomSheetRef: MatBottomSheetRef<StaffSheetComponent>,
    private dialog: MatDialog,
    private staffService: StaffService
  ) {
  }

  showMoreDetails() {
    this.bottomSheetRef.dismiss({
      action: 'view'
    });
  }

  editStaff() {
    this.bottomSheetRef.dismiss({
      action: 'edit'
    });
  }

  deleteStaff() {
    const confirmDialog = this.dialog.open(ConfirmationComponent, {
      data: {
        message: 'Are you sure you want to delete the staff member ' + this.staff.firstName + ' ' +  this.staff.lastName + '?' }
    });

    confirmDialog.afterClosed().subscribe((data) => {
      if (data) {
        this.staffService.deleteStaff(this.staff);
      }
      this.bottomSheetRef.dismiss();
    });
  }
}