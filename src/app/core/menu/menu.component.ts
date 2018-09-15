import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuService } from '../../_services/menu/menu.service';
import { UserService } from '../../_services/user/user.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {
  menuItems: any;
  opened: boolean;
  companyName = 'Company';

  constructor(
      private router: Router,
      private fireAuth: AngularFireAuth,
      private userService: UserService,
      private menuService: MenuService
  ) {
    // Todo: Opened = true on desktop, Opened = false on mobile.
    this.opened = true;

    // Listener for menu service changes
    if (this.menuService.menuItems != null) { this.updateMenu(); }
    this.menuService.menuUpdate.subscribe(() => this.updateMenu());
  }

  ngOnInit() {
    this.opened = this.menuService.menuSideOpened;
  }

  updateMenu() {
    this.menuItems = this.menuService.menuItems;
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
    // Todo: Get image from database

    return image ? image : 'account_circle';
  }

  getName() {
    return this.userService.getFullName();
  }
}
