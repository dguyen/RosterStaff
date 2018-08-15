import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../_services/auth/auth.service';
import { MenuService } from '../../_services/menu/menu.service';
import { StaffMenuItems } from './staff-portal-menu-items';

@Component({
  selector: 'app-staff-portal',
  templateUrl: './staff-portal.component.html',
  styleUrls: ['./staff-portal.component.scss']
})
export class StaffPortalComponent {
  menuService = new MenuService(StaffMenuItems);
  menuItems = this.menuService.menuItems;
  opened = true;
  companyName = 'Company';
  numBadge = 5;

  constructor(private router: Router, private authService: AuthService) {
    this.menuService.setBadge('Shifts', this.numBadge);
    // this.router.navigate(['staff/' + this.menuItems[0].routerLink]);
    this.router.navigate(['staff/shifts']);
  }

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

    return image ? image : 'account_circle';
  }

  getName() {
    let name = null;
    // try get name from database

    return name ? name : 'Please setup name';
  }
}
