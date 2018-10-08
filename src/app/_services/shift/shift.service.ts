import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { Shift } from './shift';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

export interface ShiftLocation {
  description: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private shiftObservable;
  shiftRef = 'organisation/crystal-palace/shifts';
  staffRef = 'organisation/crystal-palace/staff';
  shiftLocRef = 'organisation/crystal-palace/locations';
  shifts = Array<Shift>();
  shiftStream = new Subject();

  constructor(public userService: UserService, public fireDb: AngularFirestore) {
    this.shiftListener();
  }

  /**
   * Get an observable that obtains all locations related to the selected organisation
   */
  getShiftLocations() {
    return this.fireDb.collection(this.shiftLocRef).valueChanges();
  }

  /**
   * Add a new shift location
   * @param newShiftLoc a new shift location to create
   */
  addShiftLocation(newShiftLoc: ShiftLocation) {
    const tmpLoc = Object.assign({}, newShiftLoc);
    return this.fireDb.collection(this.shiftLocRef).add(tmpLoc);
  }

  /**
   * Edit a shift location
   * @param locationUID UID of the shift location
   * @param updatedLoc the updated shift location
   */
  editShiftLocation(locationUID: string, updatedLoc: ShiftLocation) {
    const tmpLoc = Object.assign({}, updatedLoc);
    return this.fireDb.collection(this.shiftLocRef).doc(locationUID).update(tmpLoc);
  }

  /**
   * Remove shift location from organisation
   * @param locationUID UID of shift location
   */
  removeShiftLocation(locationUID) {
    return this.fireDb.collection(this.shiftLocRef).doc(locationUID).delete();
  }

  private shiftListener() {
    this.shiftObservable = this.fireDb.collection(this.staffRef).doc(this.userService.uid).valueChanges().subscribe((data) => {
      const tmp = Array<Shift>();
      if (!data.hasOwnProperty('shifts')) {
        this.shiftStream.next([]);
        return;
      }
      for (let i = 0; i < data['shifts'].length; i++) {
        data['shifts'][i].get().then((shiftData) => {
          if (shiftData.exists) {
            const newShift = Object.assign(new Shift(), shiftData.data());
            newShift.shiftId = shiftData.id;
            tmp.push(newShift);
          }
          if (data['shifts'].length <= i + 1) {
            this.shifts = tmp;
            this.shiftStream.next(this.shifts);
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
    const batch = this.fireDb.firestore.batch();

    return new Promise((resolve, reject) => {
      if (!newShift.onDuty) { reject('onDuty property missing from Shift'); }

      this.fireDb.collection(this.shiftRef).add(
        Object.assign({}, newShift)
      ).then((data) => {
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

  /**
   * Remove a shift entry from the database
   * @param newShift a shift entry to remove from the database
   */
  deleteShift(shift: Shift) {
    const batch = this.fireDb.firestore.batch();

    return new Promise((resolve, reject) => {
      if (!shift.shiftId) { reject('ShiftId property missing from Shift'); }
      if (!shift.onDuty) { reject('onDuty property missing from Shift'); }

      // Delete the shift from the organisation's collection
      const shiftToDelete = this.fireDb.firestore.collection(this.shiftRef).doc(shift.shiftId);
      shiftToDelete.delete()
      .then(() => {
        // Remove all references of the shift from staff collection
        for (const uid in shift.onDuty) {
          if (shift.onDuty.hasOwnProperty(uid)) {
            const staffRef = this.fireDb.firestore.collection(this.staffRef).doc(uid);
            batch.update(staffRef, {
              shifts: firebase.firestore.FieldValue.arrayRemove(shiftToDelete)
            });
          }
        }
        batch.commit().then(() => resolve()).catch((err) => reject(err));
      }).catch((err) => reject(err));
    });
  }

  /**
   * Accept a shift. Returns a Promise resolving if successful, rejecting otherwise
   * @param shift a shift to accept
   */
  acceptShift(shift: Shift) {
    return this.acceptDeclineShift(shift, true);
  }

  /**
   * Decline a shift. Returns a Promise resolving if successful, rejecting otherwise
   * @param shift a shift to decline
   */
  declineShift(shift: Shift) {
    return this.acceptDeclineShift(shift, false);
  }

  private acceptDeclineShift(shift: Shift, decision: boolean) {
    return new Promise((resolve, reject) => {
      if (!shift.shiftId) { reject('ShiftId property missing from Shift'); }
      const tmp = {};
      tmp['onDuty.' + this.userService.uid + '.accepted'] = decision;
      this.fireDb.collection(this.shiftRef).doc(shift.shiftId).update(tmp).then(() => {
        resolve();
        this.updateShifts();
      }).catch((err) => reject(err));
    });
  }

  private updateShifts() {
    this.shiftObservable.unsubscribe();
    this.shiftListener();
  }

  /**
   * Returns a promise that resolves with a list of shifts related to the user
   */
  getShifts() {
    return new Promise((resolve) => {
      if (this.shifts) {
        resolve(this.shifts);
        return;
      }
      const stream = this.shiftStream.subscribe((shiftData) => {
        console.log(shiftData);
        if (stream) {
          resolve(shiftData);
          stream.unsubscribe();
        }
      });
    });
  }
}

