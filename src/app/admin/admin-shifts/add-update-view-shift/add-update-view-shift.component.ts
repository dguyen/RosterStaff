import { Component, OnInit, ViewChild, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationComponent } from '../../../shared/components/confirmation/confirmation.component';
import { CreateUpdateLocationComponent } from '../../admin-location/create-update-location/create-update-location.component';

import { ShiftService } from '../../../_services/shift/shift.service';
import { Shift } from '../../../_services/shift/shift';
import { RosterStaffTableComponent } from '../roster-staff-table/roster-staff-table.component';
import { Subscription } from 'rxjs';

/**
 * Todo
 *  - Consider what happens when shift occurs overnight (start time > end time)
 *  - Consider a maximum limit for staff in a shift
 *  - Change date format from mm/dd/yy to dd/mm/yy (or to locale style)
 */

const typeOfActions = {
  edit: {
    title: 'Edit Shift Information',
    action: 'Update Shift',
    type: 'edit'
  },
  add: {
    title: 'Shift Information',
    action: 'Create Shift',
    type: 'create'
  },
  view: {
    title: 'Shift Information',
    action: null,
    type: 'view'
  }
};

 @Component({
  selector: 'app-add-update-view-shift',
  templateUrl: './add-update-view-shift.component.html',
  styleUrls: ['./add-update-view-shift.component.scss']
})
export class AddUpdateViewShiftComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(RosterStaffTableComponent) rosterComponent: RosterStaffTableComponent;
  @Input() type: string;
  @Input() inputShift: Shift;
  locations = [];
  selectedLocation: any;
  shiftLocObs: Subscription;
  staffUIDArray: Array<string>;
  editTable = true;
  minDate = new Date();
  selectedOperation: any;
  shiftForm = new FormGroup({
    'location': new FormControl('', Validators.required),
    'date': new FormControl('', Validators.required),
    'start': new FormControl('', [Validators.required, Validators.min(0), Validators.max(2400)]),
    'end': new FormControl('', [Validators.required, Validators.min(0), Validators.max(2400)]),
    'breakDuration': new FormControl('', [Validators.min(0), Validators.max(2400)]),
    'note': new FormControl('', Validators.maxLength(300))
  });

  // Indicates whether data is loading for specific tasks
  isLoading = {
    staff: true,
    location: true,
    shift: false
  };

  constructor(
    private shiftService: ShiftService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    if (!Object.keys(typeOfActions).includes(this.type)) {
      throw Error('Type parameter is incorrect or missing');
    }
    this.selectedOperation = typeOfActions[this.type];
    this.loadInputData();
    this.loadLocations();
    this.isLoading.staff = false;
  }

  ngOnDestroy() {
    this.shiftLocObs.unsubscribe();
  }

  loadLocations() {
    let init = false;
    this.shiftLocObs = this.shiftService.locationStream.subscribe((locations: Location[]) => {
      if (!locations) { return; }
      this.isLoading.location = false;
      this.locations = locations;
      if (this.inputShift && !init) {
        const index = this.locations.findIndex((x) => x.description === this.inputShift.location.description);
        if (index < 0) {
          this.locations.push(this.inputShift.location);
          this.selectedLocation = this.locations[this.locations.length - 1];
        } else {
          this.selectedLocation = this.locations[index];
        }
      }
      init = true;
    });
  }

  ngAfterViewInit() {
  }

  private loadInputData() {
    if (!['view', 'edit'].includes(this.type)) { return; }
    if (!this.inputShift) { throw Error('Shift must be included if type of action is view or edit'); }
    if (this.type !== 'add') {
      this.staffUIDArray = Object.keys(this.inputShift.onDuty);
    }
    if (this.type === 'view') {
      this.editTable = false;
    }
    this.shiftForm.patchValue(this.inputShift);
    this.shiftForm.patchValue({ date: new Date(this.inputShift.date['seconds'] * 1000) });
  }

  /**
   * Checks shift and confirms if shift should be created if no staff is rostered
   */
  submitShift() {
    if (this.shiftForm.invalid) { return; }
    if (Object.keys(this.rosterComponent.getSelectedStaff()).length <= 0) {
      const dialogRef = this.dialog.open(ConfirmationComponent, {
        width: '30%',
        data: { message: 'You currently have no staff rostered for this shift' }
      });
      dialogRef.afterClosed().subscribe(result => result ? this.createShift() : null);
    } else {
      if (this.type === 'add') {
        this.createShift();
      } else if (this.type === 'edit') {
        this.updateShift();
      }
    }
  }

  /**
   * Update a shift
   */
  updateShift() {
    if (this.shiftForm.invalid) { return; }
    this.isLoading.shift = true;
    const updatedShift = Object.assign(new Shift, this.shiftForm.value);
    updatedShift.onDuty = this.rosterComponent.getSelectedStaff();
    updatedShift.shiftId = this.inputShift.shiftId;
    this.shiftService.updateShift(updatedShift).then(() => {
      this.isLoading.shift = false;
      this.snackBar.open('Shift updated!', null, { duration: 3000 });
    }).catch((err) => {
      this.isLoading.shift = false;
      this.snackBar.open('Something went wrong! Try again later.', null, { duration: 5000 });
    });
  }

  /**
   * Create a new shift
   */
  createShift() {
    if (this.shiftForm.invalid) { return; }
    this.isLoading.shift = true;
    const newShift = Object.assign(new Shift, this.shiftForm.value);
    newShift.onDuty = this.rosterComponent.getSelectedStaff();

    this.shiftService.createShift(newShift).then(() => {
      this.isLoading.shift = false;
      this.snackBar.open('New shift added!', null, { duration: 3000 });
    }).catch((err) => {
      this.isLoading.shift = false;
      this.snackBar.open('Something went wrong! Try again later.', null, { duration: 5000 });
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
}
