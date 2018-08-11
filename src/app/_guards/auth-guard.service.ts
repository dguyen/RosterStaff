import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { resolve } from 'url';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private fireAuth: AngularFireAuth, private router: Router) { }

  canActivate() {
    if (this.fireAuth.auth.currentUser) {
      return true;
    }
    this.router.navigate(['login']);
    return false;

    // return new Promise<boolean>((resolve, reject) => {
      // if (this.fireAuth.auth.currentUser) {
      //   resolve(true);
      // }
      
      // this.fireAuth.auth.onAuthStateChanged((user) => {
      //   if (user) {
      //     resolve(true);
      //   }
      //   this.router.navigate(['login']);
      //   resolve(false);
      // })
    // })
  }
}