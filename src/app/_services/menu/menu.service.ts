import { Injectable } from '@angular/core';

import { MenuItem } from './menu-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuItems: Array<MenuItem>;
  menuUpdate = new Subject();
  menuSideOpened = true;

  constructor() {}

  loadMenu(menuItems: Array<MenuItem>) {
    this.menuItems = menuItems;
    this.menuUpdate.next();
  }

  /**
   * Place a badge on a menu item
   * @param menuName name of menu
   * @param badgeNumber number of notifications
   */
  setBadge(menuName: string, badgeNumber: number) {
    for (let i = 0; i < this.menuItems.length; i++) {
      if (this.menuItems[i].name === menuName) {
        this.menuItems[i].hasBadge = true;
        this.menuItems[i].badgeNum = badgeNumber;
        return true;
      }
    }
    return false;
  }

  toggleMenuSidebar() {
    this.menuSideOpened = !this.menuSideOpened;
  }

  /**
   * Remove a badge from a menu item
   * @param menuName name of menu
   */
  removeBadge(menuName: string) {
    for (let i = 0; i < this.menuItems.length; i++) {
      if (this.menuItems[i].name === menuName) {
        this.menuItems[i].hasBadge = true;
        this.menuItems[i].badgeNum = null;
        return true;
      }
    }
    return false;
  }

  /**
   * Get the total number of notifications on menu items
   */
  getTotalNotifications() {
    let totalNotifications = 0;
    for (let i = 0; i < this.menuItems.length; i++) {
      if (this.menuItems[i].hasBadge) {
        totalNotifications += this.menuItems[i].badgeNum;
      }
    }
    return totalNotifications;
  }
}
