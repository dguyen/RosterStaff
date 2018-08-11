import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  constructor(private router: Router, private fireAuth: AngularFireAuth) { }

  logout() {
    this.fireAuth.auth.signOut().then((data) => {
      this.router.navigate(['login']);
    }).catch((err) => {
      // Todo: Indicate to user that signout was unsuccessful
    }); 
  }

  isLoggedIn() {
    if (this.fireAuth.auth.currentUser) {
      return "Logged in";
    }
    else {
      return "Logged out";
    }
  }
}
