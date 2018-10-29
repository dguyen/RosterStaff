import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { UserService  } from 'src/app/_services/user/user.service';

@Component({
  selector: 'app-update-view-profile',
  templateUrl: './update-view-profile.component.html',
  styleUrls: ['./update-view-profile.component.scss']
})
export class UpdateViewProfileComponent implements OnInit {
  maxDate = new Date();
  isLoading = false;
  profileForm = new FormGroup({
    'firstName': new FormControl('', [Validators.required, Validators.maxLength(50)]),
    'lastName': new FormControl('', [Validators.required, Validators.maxLength(50)]),
    'dob': new FormControl(''), // Todo: Add date validator
    'email': new FormControl('', [Validators.required, regexValidator(/.+\@.+\..+/)]),
    'phoneNum': new FormControl('', [Validators.minLength(6), Validators.maxLength(15), regexValidator(/^[0-9]*$/)]),
    'address': new FormControl('', Validators.maxLength(300))
  });

  constructor(private userService: UserService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (!this.userService.profile.isReady) {
      throw new Error('Unable to load profile');
    }
    this.profileForm.patchValue(this.userService.profile);
  }

  /**
   * Update profile details of signed in user
   */
  updateDetails() {
    if (this.profileForm.invalid) { return; }
    this.isLoading = true;
    this.userService.updateProfile(this.profileForm.value).then(() => {
      this.snackBar.open('Successfully updated profile', null, { duration: 4000 });
      this.isLoading = false;
    }).catch(() => {
      this.snackBar.open('Something went wrong during update, please try again later', null, { duration: 5000 });
      this.isLoading = false;
    });
  }
}

export function regexValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = !nameRe.test(control.value);
    return forbidden ? {'invalidFormat': {value: control.value}} : null;
  };
}
