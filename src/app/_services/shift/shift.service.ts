import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { Shift } from './shift';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs';
import firebase from '@firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  shiftRef = 'organisation/crystal-palace/shifts';
  staffRef = 'organisation/crystal-palace/staff';
  shifts = Array<Shift>();
  shiftStream = new Subject();

  constructor(public userService: UserService, public fireDb: AngularFirestore) {
    this.shiftListener();
  }

  private shiftListener() {
    this.fireDb.collection(this.staffRef).doc(this.userService.uid).valueChanges().subscribe((data) => {
      const tmp = Array<Shift>();
      if (!data.hasOwnProperty('shifts')) { return; }
      for (let i = 0; i < data['shifts'].length; i++) {
        data['shifts'][i].get().then((shiftData) => {
          if (shiftData.exists) {
            const tmpData = shiftData.data();
            tmpData.shiftId = shiftData.id;
            tmp.push(tmpData);

            if (data['shifts'].length <= i + 1) {
              this.shifts = tmp;
              this.shiftStream.next(this.shifts);
            }
          }
        });
      }
    });
  }

  /**
   * Create a new shift entry in the database
   * @param newShift a new shift entry to add to the database
   */
  createShift(newShift: Shift) {
    return new Promise((resolve, reject) => {
      // Add the shift to the organisation's collection
      this.fireDb.collection(this.shiftRef).add(
        Object.assign({}, newShift)
      ).then((data) => {
        const batch = this.fireDb.firestore.batch();

        // Add a reference to the shift for all related staff
        for (const uid in newShift.onDuty) {
          if (newShift.onDuty.hasOwnProperty(uid)) {
            const staffRef = this.fireDb.firestore.collection(this.staffRef).doc(uid);
            batch.update(staffRef, {
              shifts: firebase.firestore.FieldValue.arrayUnion(data)
            });
          }
        }

        batch.commit().then(() => resolve()).catch((err) => reject(err));
      }).catch((err) => reject(err));
    });
  }

  // TODO
  acceptShift(shift: Shift) {

  }

  // TODO
  declineShift(shift: Shift) {

  }

  /**
   * Returns a promise that resolves with a list of shifts related to the user
   */
  getShifts() {
    return new Promise((resolve) => {
      if (this.shifts.length > 0) {
        resolve(this.shifts);
      }
      this.shiftStream.subscribe((shiftData) => {
        resolve(shiftData);
      });
    });
  }
}
