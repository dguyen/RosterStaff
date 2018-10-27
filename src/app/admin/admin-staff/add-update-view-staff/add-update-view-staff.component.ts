import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { StaffService, Staff } from 'src/app/_services/staff/staff.service';
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
  isLoading = false;
  staffForm = new FormGroup({
    'firstName': new FormControl('', [Validators.required, Validators.maxLength(50)]),
    'lastName': new FormControl('', [Validators.required, Validators.maxLength(50)]),
    'dob': new FormControl(''), // Todo: Add date validator
    'email': new FormControl('', [Validators.required, regexValidator(/.+\@.+\..+/)]),
    'phoneNum': new FormControl('', [Validators.minLength(6), Validators.maxLength(15), regexValidator(/^[0-9]*$/)]),
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
    this.isLoading = true;
    const tmpStaff = Object.assign(new Staff, this.staffForm.value);
    tmpStaff['role'] = 'STAFF'; // Todo remove hardcode
    this.staffService.createStaff(tmpStaff).then(() => {
      this.isLoading = false;
      this.snackBar.open('New staff successfully created', null, { duration: 5000 });
    }).catch((err) => {
      this.isLoading = false;
      if (err.code === 'already-exists') {
        this.staffForm.get('email').setErrors( { 'email-taken': true });
        return;
      } else {
        this.snackBar.open('Something went wrong during the account creation of ' + tmpStaff.firstName + ' ' + tmpStaff.lastName +
        '. Please try again later', null, { duration: 10000 });
      }
    });
  }

  /**
   * Update a staff member
   */
  editStaff() {
    if (this.staffForm.invalid) { return; }
    // Todo
  }
}

export function regexValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = !nameRe.test(control.value);
    return forbidden ? {'invalidFormat': {value: control.value}} : null;
  };
}
