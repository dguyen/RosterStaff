import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../_services/auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  constructor(private router: Router, private authService: AuthService) { }

  logout() {
    this.authService.auth.signOut().then((data) => {
      this.router.navigate(['login']);
    }).catch((err) => {
      // Todo: Indicate to user that signout was unsuccessful
    }); 
  }
}
