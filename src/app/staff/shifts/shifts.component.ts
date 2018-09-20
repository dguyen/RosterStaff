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
    const uid = this.shiftService.userService.uid;
    data.forEach(aShift => {
      const status = aShift.getStatus(uid);
      if (status == null && !aShift.hasStarted()) {
        pendingShifts.push(aShift);
      } else if (status && !aShift.hasPassed()) {
        currentShifts.push(aShift);
      }
    });

    this.shiftHistoryStream.next(data);
    this.pendingShiftStream.next(pendingShifts);
    this.currentShiftStream.next(currentShifts);
  }
}
