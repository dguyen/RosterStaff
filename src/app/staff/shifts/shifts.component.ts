import { Component, OnInit } from '@angular/core';
import { ShiftService } from '../../_services/shift/shift.service';
import { Shift } from '../../_services/shift/shift';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss']
})
export class ShiftsComponent implements OnInit {
  avaliableShifts: Shift[];
  currentShifts: Shift[];
  shiftHistory: Shift[];

  constructor(public shiftService: ShiftService) {
  }

  ngOnInit() {
    this.shiftService.getShifts();
    this.avaliableShifts = this.shiftService.shifts;

    // console.log(this.avaliableShifts);

    this.shiftService.shiftStream.subscribe((data: Shift[]) => {
      this.updateShifts(data);
    });
  }

  updateShifts(data: Shift[]) {
    const pendingShifts = new Array<Shift>();
    const currentShifts = new Array<Shift>();

    data.forEach(aShift => {
      const status = this.getStatus(aShift);
      if (status == null && !this.hasPassed(aShift)) {
        pendingShifts.push(aShift);
      } else if (status && !this.hasPassed(aShift)) {
        currentShifts.push(aShift);
      }
    });

    this.shiftHistory = data;
    this.avaliableShifts = pendingShifts;
    this.currentShifts = currentShifts;
  }

  // TODO: return true if date has passed
  hasPassed(shift: Shift) {
    return false;
  }

  getStatus(shift: Shift) {
    if (!shift) { throw new Error('Parametter is undefined'); }

    return shift.onDuty.find((element) => {
      return element.uid === this.shiftService.userService.uid;
    }).accepted;
  }
}
