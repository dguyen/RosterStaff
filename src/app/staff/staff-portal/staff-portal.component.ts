import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MenuService } from '../../_services/menu/menu.service';
import { StaffMenuItems } from './staff-portal-menu-items';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../../_services/user/user.service';

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

  constructor(private router: Router, private fireAuth: AngularFireAuth, private userService: UserService) {
    this.menuService.setBadge('Shifts', this.numBadge);
    this.router.navigate([router.url]);
  }

  logout() {
    this.fireAuth.auth.signOut().then((data) => {
      this.router.navigate(['']);
    }).catch((err) => {
      // Todo: Indicate to user that signout was unsuccessful
    });
  }

  getProfilePicture() {
    const image = null;
    // try get from database

    return image ? image : 'account_circle';
  }

  getName() {
    return this.userService.getFullName();
  }
}
