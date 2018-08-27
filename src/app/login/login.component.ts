import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../_services/user/user.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

class ErrorMessage {
  email = '';
  pass = '';
  unknown = '';
}

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
  errorMsg = new ErrorMessage;

  constructor(
    private fireAuth: AngularFireAuth,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.routeUser();
      }
    });
  }

  ngOnInit() {
  }

  routeUser() {
    if (!this.fireAuth.auth.currentUser) {
      return;
    }

    // TODO: Select organisation
    // if (this.userService.org.listOfOrgs.length > 1) {
    //   console.log('Select your organisation');
    // }

    // TODO: User selects organisation [HARDCODED crystal-palace]
    // const selectedOrg = 'crystal-palace';
    // this.userService.loadUserData(selectedOrg);

    // Get roles
    this.userService.getRoles().then((roles: string[]) => {
      if (roles.length > 1) {
        console.log('Select which portal');
      } else {
        console.log('Navigating to: ' + roles[0].toLowerCase());
        this.router.navigate([roles[0].toLowerCase()]);
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  login() {
    this.errorMsg = new ErrorMessage;
    this.showLoading = true;
    const session = this.keepSignedIn ? 'local' : 'session';

    this.fireAuth.auth.setPersistence(session).then(() => {
      this.fireAuth.auth.signInWithEmailAndPassword(this.email, this.password).catch((err) => {
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
