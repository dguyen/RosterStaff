import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { MenuService } from '../../_services/menu/menu.service';
import { UserService } from '../../_services/user/user.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit, OnDestroy {
  menuItems: any;
  opened: boolean;
  companyName = 'Company';

  constructor(
      private router: Router,
      private fireAuth: AngularFireAuth,
      private userService: UserService,
      private menuService: MenuService,
      private snackBar: MatSnackBar
  ) {
    // Listener for menu service changes
    if (this.menuService.menuItems != null) { this.updateMenu(); }
    this.menuService.menuUpdate.subscribe(() => this.updateMenu());
  }

  ngOnInit() {
    this.opened = this.menuService.menuSideOpened;
  }

  ngOnDestroy() {
    this.menuService.menuSideOpened = this.opened;
  }

  updateMenu() {
    this.menuItems = this.menuService.menuItems;
  }

  logout() {
    this.fireAuth.auth.signOut().then(() => {
      this.router.navigate(['']);
    }).catch(() => {
      this.snackBar.open('An error occured during signout, please check your network connection and try again', null, { duration: 10000 });
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
