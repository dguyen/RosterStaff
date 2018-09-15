import { Component } from '@angular/core';
import { MenuService } from '../../_services/menu/menu.service';
import { AdminMenuItems } from '../admin-menu-items';

@Component({
  selector: 'app-admin-portal',
  template: `<app-menu></app-menu>`
})
export class AdminPortalComponent {

  constructor(private menuService: MenuService) {
    this.menuService.loadMenu(AdminMenuItems);
  }
}
