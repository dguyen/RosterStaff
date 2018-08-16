import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

import { AuthService } from '../_services/auth/auth.service';
import firebase from '@firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  showLoading = false;
  keepSignedIn = false;
  errorMsg = {
    email: '',
    pass: '',
    unknown: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    authService.isAuthenticatedPromise().then(() => {
      this.router.navigate(['staff']);
    });
  }

  ngOnInit() {
  }

  resetErrorMsg() {
    this.errorMsg = {
      email: '',
      pass: '',
      unknown: ''
    };
  }

  login() {
    this.resetErrorMsg();
    this.showLoading = true;
    const session = this.keepSignedIn ?
      firebase.auth.Auth.Persistence.LOCAL :
      firebase.auth.Auth.Persistence.SESSION;

    this.authService.getAuth().setPersistence(session).then(() => {
      this.authService.signIn(this.email, this.password).then(() => {
        this.router.navigate(['staff']); // Todo: Differentiate between staff and admin
      }).catch((err) => {
        this.showLoading = false;
        if (err.code === 'auth/wrong-password') {
          this.errorMsg.pass = 'Wrong password.';
        } else if (err.code === 'auth/invalid-email') {
          this.errorMsg.email = 'Email is invalid. Check email and try again.';
        } else if (err.code === 'auth/user-not-found') {
          this.errorMsg.email = 'Email not found. Check email and try again.';
        } else {
          this.errorMsg.unknown = 'Something went wrong, please try again later.';
        }
      });
    }).catch((err) => {
      this.showLoading = false;
      this.errorMsg.unknown = 'Something went wrong, please try again later.';
    });
  }

  openResetPass() {
    this.dialog.open(ForgotPasswordComponent, {
      width: '22em',
      data: {email: this.email }
    });
  }
}

@Component({
  selector: 'app-forgot-password',
  template: `
    <mat-spinner
      mode="indeterminate"
      diameter=20
      color="accent"
      *ngIf="showLoading"
      style="float: right;">
    </mat-spinner>

    <h2 mat-dialog-title>Reset Password</h2>
    <div *ngIf="!emailSent">
      <mat-dialog-content>
        <mat-form-field style="width: 100%">
          <input matInput [(ngModel)]="email" spellcheck=false (keyup.enter)="sendReset()" placeholder="Email">
        </mat-form-field>
        <p style="color: red; font-size: 0.8em; margin: 0; height: 1.5em">{{ message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions style="float:right">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-button color="accent" (click)="sendReset()" [disabled]="showLoading">Send</button>
      </mat-dialog-actions>
    </div>

    <div *ngIf="emailSent">
      <mat-dialog-content>
        <p>Email sent successfully</p>
      </mat-dialog-content>
      <mat-dialog-actions style="float:right">
      <button mat-button mat-dialog-close>Okay</button>
      </mat-dialog-actions>
    </div>
  `
})
export class ForgotPasswordComponent {
  showLoading = false;
  emailSent = false;
  email = '';
  message = '';

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.email) {
      this.email = data.email;
    }
  }

  sendReset() {
    this.emailSent = false;
    this.showLoading = true;
    this.message = '';
    firebase.auth().sendPasswordResetEmail(this.email).then(() => {
      this.showLoading = false;
      this.emailSent = true;
    }).catch((err) => {
      this.showLoading = false;
      if (err.code === 'auth/invalid-email' || err.code === 'auth/argument-error') {
        this.message = 'Email is invalid. Please check email and try again.';
      } else if (err.code === 'auth/user-not-found') {
        this.message = 'Email was not found in the system';
      } else {
        this.message = 'Something went wrong. Please try again later.';
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
