import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShiftService } from '../../_services/shift/shift.service';
import { Shift } from '../../_services/shift/shift';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss']
})
export class ShiftsComponent implements OnInit, OnDestroy {
  private shiftStreamRef: Subscription;
  avaliableShifts: Shift[];
  currentShifts: Shift[];
  shiftHistory: Shift[];

  constructor(public shiftService: ShiftService) {
  }

  ngOnInit() {
    this.avaliableShifts = this.shiftService.shifts;

    if (this.shiftService.shifts.length > 0) {
      this.updateShifts(this.shiftService.shifts);
    }
    this.shiftStreamRef = this.shiftService.shiftStream.subscribe((data: Shift[]) => {
      this.updateShifts(data);
    });
  }

  ngOnDestroy() {
    if (this.shiftStreamRef) { this.shiftStreamRef.unsubscribe(); }
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
    if (!shift) { throw new Error('Parameter is undefined'); }
    const uid = this.shiftService.userService.uid;
    if (shift.onDuty[uid]) {
      return shift.onDuty[uid].accepted;
    }
    throw Error('onDuty data not found on shift');
  }
}
