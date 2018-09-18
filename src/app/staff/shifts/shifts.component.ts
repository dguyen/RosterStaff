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
  private shiftStream: Subscription;
  pendingShiftStream = new Subject();
  shiftHistoryStream = new Subject();
  currentShiftStream = new Subject();

  constructor(public shiftService: ShiftService) { }

  ngOnInit() {
    // Get initial shift data
    this.shiftService.getShifts().then((shifts: Shift[]) => this.updateShifts(shifts));

    // Subscribe to shift updates
    this.shiftStream = this.shiftService.shiftStream.subscribe((shifts: Shift[]) => {
      this.updateShifts(shifts);
    });
  }

  ngOnDestroy() {
    if (this.shiftStream) {
      this.shiftStream.unsubscribe();
    }
  }

  updateShifts(data: Shift[]) {
    const pendingShifts = new Array<Shift>();
    const currentShifts = new Array<Shift>();

    data.forEach(aShift => {
      const status = this.getStatus(aShift);
      if (status == null && !this.hasPassed(aShift)) {
        pendingShifts.push(aShift);
      } else if (status && !this.hasPassedIncDuration(aShift)) {
        currentShifts.push(aShift);
      }
    });

    this.shiftHistoryStream.next(data);
    this.pendingShiftStream.next(pendingShifts);
    this.currentShiftStream.next(currentShifts);
  }

  /** Returns true if shift date has already passed  */
  hasPassed(shift: Shift) {
    if (!shift) { throw new Error('Parameter is undefined'); }
    return (shift.date['seconds']) * 1000 < Date.now();
  }

  /** Returns true if (shift date + shift duration) has already passed  */
  hasPassedIncDuration(shift: Shift) {
    if (!shift) { throw new Error('Parameter is undefined'); }
    const shiftLength = (shift.end - shift.start).toString();
    let additionalSeconds = 0;

    // Convert the shift duration into millis
    if (shiftLength.length <= 2) {
      additionalSeconds = Number.parseInt(shiftLength) * 60;
    } else {
      const sLength = shiftLength.length;
      const minutes = Number.parseInt(shiftLength.substring(sLength - 2, sLength));
      const hours = Number.parseInt(shiftLength.substring(0, sLength - 2));
      additionalSeconds = hours * 3600 + minutes * 60;
    }
    return (shift.date['seconds'] + additionalSeconds) * 1000 < Date.now();
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
