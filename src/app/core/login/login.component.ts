import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../../_services/user/user.service';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SelectOrganisationComponent } from './select-organisation/select-organisation.component';
import { SelectPortalComponent } from './select-portal/select-portal.component';

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
export class LoginComponent {
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

    const unsubscribe = this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.routeUser();
      }
      unsubscribe();
    });
  }

  /**
   * Route the user to the correct portal
   */
  routeUser() {
    if (!this.fireAuth.auth.currentUser) {
      return;
    }

    // Select organisation
    // this.selectOrganisation(this.userService.org.listOfOrgs).subscribe(result => {
    //   console.log(result);
    // });

    // Get roles
    this.userService.getRoles().then((roles: string[]) => {
      this.selectPortal(roles);
    }).catch((err) => {
      console.log(err);
    });
  }

  /**
   * Log in the user
   */
  login() {
    this.errorMsg = new ErrorMessage;
    this.showLoading = true;
    const session = this.keepSignedIn ? 'local' : 'session';

    this.fireAuth.auth.setPersistence(session).then(() => {
      this.fireAuth.auth.signInWithEmailAndPassword(this.email, this.password).then(() => {
        this.routeUser();
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

  /**
   * Allows the user to select which organisation's portal view
   * @param organisations array of organisations the user can select from
   */
  selectOrganisation(organisations: Array<string>) {
    if (organisations.length === 1) {
      this.userService.loadUserData(organisations[0]);
      return;
    }

    const selectOrgDialog = this.dialog.open(SelectOrganisationComponent, {
      width: '22em',
      data: {organisations: organisations}
    });

    return selectOrgDialog.afterClosed();
  }

  /**
   * Navigates the user to a selected portal
   * @param portals array of potiential portals the user can go to
   */
  selectPortal(portals: Array<string>) {
    if (portals.length === 1) {
      this.router.navigate([portals[0].toLowerCase()]);
      return;
    }

    this.dialog.open(SelectPortalComponent, {
      width: '15em',
      data: { portals: portals}
    }).afterClosed().subscribe(result => {
      if (!result) {
        this.resetLoginProcess();
      } else {
        this.router.navigate([result.toLowerCase()]);
        return;
      }
    });
  }

  /**
   * Reset the login process
   */
  resetLoginProcess() {
    this.errorMsg = new ErrorMessage();
    this.showLoading = false;
    this.fireAuth.auth.signOut();
  }

  /**
   * Opens the Forgot Password dialog
   */
  openResetPass() {
    this.dialog.open(ForgotPasswordComponent, {
      width: '22em',
    data: {email: this.email }
    });
  }
}
