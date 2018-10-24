import { Component } from '@angular/core';
import { MenuService } from '../../_services/menu/menu.service';
import { ShiftService } from '../../_services/shift/shift.service';

import { StaffMenuItems } from '../staff-menu-items';
import { Shift } from '../../_services/shift/shift';

@Component({
  selector: 'app-staff-portal',
  template: `<app-menu></app-menu>`
})
export class StaffPortalComponent {

  constructor(private menuService: MenuService, private shiftService: ShiftService) {
    this.menuService.loadMenu(StaffMenuItems);

    this.shiftService.getShifts().then((shifts: Shift[]) => {
      this.updateShiftBadge(shifts);
    });
    this.setupListeners();
  }

  setupListeners() {
    this.shiftService.shiftStream.subscribe((shifts: Shift[]) => {
      if (shifts) {
        this.updateShiftBadge(shifts);
      }
    });
  }

  /** Update the shift badge number on the menu */
  updateShiftBadge(shifts: Shift[]) {
    const uid = this.shiftService.userService.uid;
    let numPending = 0;
    shifts.forEach(aShift => {
      const status = aShift.getStatus(uid);
      if (status == null && !aShift.hasPassed()) {
        numPending++;
      }
    });
    this.menuService.setBadge('Shifts', numPending);
  }
}
