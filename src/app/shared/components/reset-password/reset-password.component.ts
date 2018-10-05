import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../../../_services/user/user.service';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  savingPassword = false;

  constructor(private fireAuth: AngularFireAuth, private userService: UserService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.passwordForm = new FormGroup({
      'currentPassword': new FormControl('', Validators.required),
      'newPassword': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'confirmPassword': new FormControl('', [Validators.required, Validators.minLength(6)])
    }, { validators: passwordMatchValidator});
  }

  updatePassword() {
    if (this.passwordForm.invalid) { return; }

    const oldPassword = this.passwordForm.get('currentPassword');
    const newPassword = this.passwordForm.get('confirmPassword');
    const currPassword = this.passwordForm.get('currentPassword');
    this.savingPassword = true;

    this.userService.reauthenticateUser(oldPassword.value).then(() => {
      this.fireAuth.auth.currentUser.updatePassword(newPassword.value).then(() => {
        this.savingPassword = false;
        this.snackBar.open('Successfully changed password', null, { duration: 4000 });
      }).catch((err) => {
        this.savingPassword = false;
        console.log(err);
      });
    }).catch((err) => {
      this.passwordForm.get('currentPassword').setErrors({ authenticated: true });
      this.savingPassword = false;
      switch (err) {
        case err.code === 'auth/wrong-password':
          currPassword.setErrors({ 'authenticated': true });
      }
    });
  }
}

export const passwordMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const confirmPass = control.get('confirmPassword');
  if (newPassword.value === confirmPass.value) {
    confirmPass.setErrors(null);
    return null;
  } else {
    confirmPass.setErrors({'passwordMatch': true});
    return {'passwordMatch': false};
  }
};
