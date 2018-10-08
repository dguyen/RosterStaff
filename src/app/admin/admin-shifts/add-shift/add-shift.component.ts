import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CreateUpdateLocationComponent } from '../create-update-location/create-update-location.component';

import { ShiftService } from '../../../_services/shift/shift.service';
import { StaffService } from '../../../_services/staff/staff.service';
import { Shift } from '../../../_services/shift/shift';
import { Staff } from '../../../_services/staff/staff';


/**
 * Todo
 *  - Consider what happens when shift occurs overnight (start time > end time)
 *  - Consider a maximum limit for staff in a shift
 *  - Validate date so it cannot be in the past
 *  - Stop checkbox from unchecking after creating shift
 *  - Change date format from mm/dd/yy to dd/mm/yy (or to locale style)
 */

@Component({
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: ['./add-shift.component.scss']
})
export class AddShiftComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select', 'name', 'emailContact', 'phoneContact'];
  dataSource = new MatTableDataSource<Staff>();
  selection = new SelectionModel<any>(true, []);

  shiftForm: FormGroup;
  locations = [];
  selectedLocation: any;

  // Indicates whether data is loading for specific tasks
  isLoading = {
    staff: true,
    location: true,
    creatingShift: false
  };

  constructor(
    private shiftService: ShiftService,
    private staffService: StaffService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.initializeRosterTable();

    this.shiftService.getShiftLocations().subscribe((locations) => {
      this.isLoading.location = false;
      this.locations = locations;
    });

    this.shiftForm = new FormGroup({
      'location': new FormControl('', Validators.required),
      'date': new FormControl('', Validators.required),
      'start': new FormControl('', [Validators.required, Validators.min(0), Validators.max(2400)]),
      'end': new FormControl('', [Validators.required, Validators.min(0), Validators.max(2400)]),
      'breakDuration': new FormControl('', [Validators.min(0), Validators.max(2400)]),
      'note': new FormControl('', Validators.maxLength(300))
    });
  }

  private initializeRosterTable() {
    this.staffService.staffStream.subscribe((staffArray: Staff[]) => {
      if (staffArray) {
        this.dataSource.data = staffArray;
        this.isLoading.staff = false;
      }
    });

    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /**
   * Create a new shift
   */
  createShift() {
    if (this.shiftForm.invalid) { return; }
    this.isLoading.creatingShift = true;
    const newShift = Object.assign(new Shift, this.shiftForm.value);
    newShift.onDuty = this.getStaffUID();

    // Todo: Confirm if user intended to create shift with no rostered staff
    if (Object.keys(newShift.onDuty).length <= 0) {}

    this.shiftService.createShift(newShift).then(() => {
      this.isLoading.creatingShift = false;
      this.snackBar.open('New shift added!', null, { duration: 3000 });
    }).catch((err) => {
      this.isLoading.creatingShift = false;
      console.log(err);
    });
  }

  /**
   * Open a new dialog for a user to create a new location
   */
  addNewLocation() {
    const dialogRef = this.dialog.open(CreateUpdateLocationComponent, {
      width: '50%',
      data: { type: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedLocation = this.locations.filter((x) => x.description === result.description)[0];
      }
    });
  }

  /**
   * Get the UID of all rostered staff members
   */
  getStaffUID() {
    const onDuty = {};
    this.selection.selected.forEach(element => {
      onDuty[element.uid] = {
        name: element.firstName
      };
    });
    return onDuty;
  }
}
