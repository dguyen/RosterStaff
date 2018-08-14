import { Injectable } from '@angular/core';

import { MenuItem } from './menu-item';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuItems: Array<MenuItem>;

  constructor(menuItems: Array<MenuItem>) {
    this.menuItems = menuItems;
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
