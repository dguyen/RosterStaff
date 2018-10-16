import { Component, OnInit, Input } from '@angular/core';
import { Staff } from 'src/app/_services/staff/staff';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StaffService } from 'src/app/_services/staff/staff.service';
import { MatSnackBar, MatDialog } from '@angular/material';

const typeOfActions = {
  edit: {
    title: 'Update Staff Information',
    action: 'Update Staff',
    type: 'edit'
  },
  add: {
    title: 'Staff Information',
    action: 'Add New Staff',
    type: 'add'
  },
  view: {
    title: 'Staff Information',
    action: null,
    type: 'view'
  }
};

@Component({
  selector: 'app-add-update-view-staff',
  templateUrl: './add-update-view-staff.component.html',
  styleUrls: ['./add-update-view-staff.component.scss']
})
export class AddUpdateViewStaffComponent implements OnInit {
  @Input() type: string;
  @Input() inputStaff: Staff;
  selectedOperation: any;
  maxDate = new Date();
  staffForm = new FormGroup({
    'firstName': new FormControl('', Validators.required),
    'lastName': new FormControl('', Validators.required),
    'dob': new FormControl(''), // Todo: Add date validator
    'email': new FormControl('', [Validators.required]),
    'phoneNum': new FormControl(''), // Todo: Add phone number validator
    'address': new FormControl('', Validators.maxLength(300))
  });

  constructor(
    private staffService: StaffService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    if (!Object.keys(typeOfActions).includes(this.type)) {
      throw Error('Type parameter is incorrect or missing');
    }
    this.selectedOperation = typeOfActions[this.type];
    this.loadInputStaff();
  }

  /**
   * Load the inputted staff into the form for updating or viewing
   */
  loadInputStaff() {
    if (this.type === 'add') { return; }
    if (!this.inputStaff) { throw Error('Input staff required if operation is view or update'); }
    this.staffForm.patchValue(this.inputStaff);
  }

  /**
   * Submit the staff for creation or updating
   */
  submitStaff() {
    if (this.type === 'add') {
      this.createStaff();
    } else if (this.type === 'edit') {
      this.editStaff();
    }
  }

  /**
   * Creates a new staff member
   */
  createStaff() {
    if (this.staffForm.invalid) { return; }
    // Todo
  }

  /**
   * Update a staff member
   */
  editStaff() {
    if (this.staffForm.invalid) { return; }
    // Todo
  }
}
