import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../../_services/user/user.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showLoading = false;

  constructor(
    private fireAuth: AngularFireAuth,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    const unsubscribe = this.fireAuth.auth.onAuthStateChanged((user) => {
      user ? this.routeUser() : unsubscribe();
    });
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'keepSignedIn': new FormControl()
    });
  }

  /**
   * Route the user to the correct portal
   */
  routeUser() {
    if (!this.fireAuth.auth.currentUser) { return; }
    this.showLoading = true;

    this.userService.getRoles().then((role: string) => {
      if (role === 'ADMIN' || role === 'MANAGER') {
        this.router.navigate(['admin']);
      } else {
        this.router.navigate(['staff']);
      }
    }).catch((err) => {
      this.showLoading = false;
      this.throwErrorMessage();
    });
  }

  /**
   * Validate login form and signs user in
   */
  login() {
    if (this.loginForm.invalid) { return; }
    const form = this.loginForm;
    this.showLoading = true;
    const session = form.get('keepSignedIn').value ? 'local' : 'session';
    this.fireAuth.auth.setPersistence(session).then(() => {
      this.fireAuth.auth.signInWithEmailAndPassword(form.get('email').value, form.get('password').value).then(() => {
        this.routeUser();
      }).catch((err) => {
        this.showLoading = false;
        if (err.code === 'auth/wrong-password') {
          form.get('password').setErrors({ incorrect: true });
        } else if (err.code === 'auth/invalid-email') {
          form.get('email').setErrors({ invalid: true });
        } else if (err.code === 'auth/user-not-found') {
          form.get('email').setErrors({ notFound: true });
        } else {
          this.throwErrorMessage();
        }
      });
    }).catch((err) => {
      this.showLoading = false;
      this.throwErrorMessage();
    });
  }

  /**
   * Open a snackbar with a generic error message
   */
  throwErrorMessage() {
    this.snackBar.open('Something went wrong. Please try again later, or email support', null, { duration: 5000 });
  }

  /**
   * Opens the Forgot Password dialog
   */
  openResetPass() {
    this.dialog.open(ForgotPasswordComponent, {
      width: '22em',
    data: {email: this.loginForm.get('email').value }
    });
  }
}
