import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { Shift } from './shift';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  shiftRef = 'organisation/crystal-palace/shifts';
  shifts = Array<Shift>();
  shiftStream = new Subject();

  constructor(public userService: UserService, public fireDb: AngularFirestore) {
    console.log('Init ShiftService');
  }

  // TODO
  createShift(newShift: Shift) {
    // 1. Create a shift object inside organisation
    // 2. Create a reference in all related people's directory
    this.fireDb.collection(this.shiftRef).add(
      Object.assign({}, newShift)
    ).then((data) => {
      console.log(data);
    }).catch((err) => {
      console.log(err);
    });
  }

  // TODO
  acceptShift(shift: Shift) {
    // 1. Set shift status to accepted
  }

  // TODO
  declineShift(shift: Shift) {

  }

  getShifts() {
    this.fireDb.collection('organisation/crystal-palace/staff').doc(this.userService.uid).valueChanges().subscribe((data) => {
      data['shifts'].forEach(element => {
        element.get().then((shiftData) => {
          this.shifts.push(shiftData.data());
          this.shiftStream.next(this.shifts); // TODO: post next after all data gathered
        });
      });
    });
  }
}
