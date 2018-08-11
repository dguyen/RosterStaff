import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../_services/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    return new Promise<boolean>((resolve) => {
      this.authService.getAuth().onAuthStateChanged((user) => {
        if (user || this.authService.isAuthenticated()) {
          resolve(true);
          return;
        }
        this.router.navigate(['login']);
        resolve(false);
      })
    })
  }
}