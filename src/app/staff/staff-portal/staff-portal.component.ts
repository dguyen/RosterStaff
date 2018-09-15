import { Component } from '@angular/core';
import { MenuService } from '../../_services/menu/menu.service';
import { StaffMenuItems } from '../staff-menu-items';

@Component({
  selector: 'app-staff-portal',
  template: `<app-menu></app-menu>`
})
export class StaffPortalComponent {

  constructor(private menuService: MenuService) {
    this.menuService.loadMenu(StaffMenuItems);

    // Todo: Get actual number of pending shifts
    this.menuService.setBadge('Shifts', 5);
  }
}
