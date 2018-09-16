import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShiftService } from '../../_services/shift/shift.service';
import { Shift } from '../../_services/shift/shift';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss']
})
export class ShiftsComponent implements OnInit, OnDestroy {
  private shiftStreamRef: Subscription;
  pendingShiftStream = new Subject();
  shiftHistoryStream = new Subject();
  currentShiftStream = new Subject();

  constructor(public shiftService: ShiftService) { }

  ngOnInit() {
    this.shiftService.getShifts().then((shifts: Shift[]) => {
      this.updateShifts(shifts);
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

    this.shiftHistoryStream.next(data);
    this.pendingShiftStream.next(pendingShifts);
    this.currentShiftStream.next(currentShifts);
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
    throw Error('onDuty property missing from Shift');
  }
}
