import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../_services/auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  opened: boolean = true;

  constructor(private router: Router, private authService: AuthService) { }

  logout() {
    this.authService.auth.signOut().then((data) => {
      this.router.navigate(['']);
    }).catch((err) => {
      // Todo: Indicate to user that signout was unsuccessful
    }); 
  }

  getProfilePicture() {
    let image = null;
    // try get from database
    
    return image ? image : "account_circle";
  }

  getName() {
    let name = null;
    // try get name from database

    return name ? name : "Please setup name";
  }
}
