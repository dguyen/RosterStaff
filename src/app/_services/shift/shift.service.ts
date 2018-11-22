import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { Shift } from './shift';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

export interface ShiftLocation {
  description: string;
  address: string;
  uid: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private shiftObservable;
  private locationObservable;
  shiftRef: string;
  staffRef: string;
  shiftLocRef: string;
  shifts = Array<Shift>();
  shiftStream = new BehaviorSubject<Shift[]>(null); // Only streams shifts relating to the signed in user
  locations = Array<Location>();
  locationStream = new BehaviorSubject<Location[]>(null);

  constructor(public userService: UserService, public fireDb: AngularFirestore) {
    this.setupService();
    firebase.auth().onAuthStateChanged((user) => {
      user ? this.setupService() : this.clearService();
    });
  }

  private setupService() {
    this.userService.getOrganisation().then((org) => {
      this.clearService();
      this.shiftRef = 'organisation/' + org['orgId'] + '/shifts';
      this.staffRef = 'organisation/' + org['orgId'] + '/staff';
      this.shiftLocRef = 'organisation/' + org['orgId'] + '/locations';
      this.shiftListener();
      this.locationListener();
    });
  }

  private clearService() {
    this.shifts = Array<Shift>();
    this.locations = Array<Location>();
    this.shiftStream.next(null);
    this.locationStream.next(null);
    if (this.shiftObservable) {
      this.shiftObservable.unsubscribe();
    }
    if (this.locationObservable) {
      this.locationObservable.unsubscribe();
    }
  }

  /**
   * Returns a promise that obtains all locations related to the selected organisation
   */
  getShiftLocations() {
    return new Promise((resolve) => {
      if (this.locations) {
        resolve(this.locations);
        return;
      }
      const stream = this.locationStream.subscribe((locations: Location[]) => {
        if (stream) {
          resolve(locations);
          stream.unsubscribe();
        }
      });
    });
  }

  /**
   * Add a new shift location
   * @param newShiftLoc a new shift location to create
   */
  addShiftLocation(newShiftLoc: ShiftLocation) {
    const tmpLoc = Object.assign({}, newShiftLoc);
    tmpLoc.uid = this.fireDb.createId();
    return this.fireDb.collection(this.shiftLocRef).doc(tmpLoc.uid).set(tmpLoc);
  }

  /**
   * Edit a shift location
   * @param locationUID UID of the shift location
   * @param updatedLoc the updated shift location
   */
  editShiftLocation(updatedLoc: ShiftLocation) {
    const tmpLoc = Object.assign({}, updatedLoc);
    return this.fireDb.collection(this.shiftLocRef).doc(updatedLoc.uid).update(tmpLoc);
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
            tmp.push(Object.assign(new Shift(), shiftData.data()));
          }
          if (data['shifts'].length <= i + 1) {
            this.shifts = tmp;
            this.shiftStream.next(this.shifts);
          }
        });
      }
    });
  }

  private locationListener() {
    this.locationObservable = this.fireDb.collection(this.shiftLocRef).valueChanges().subscribe((locations: Location[]) => {
      this.locationStream.next(locations);
    });
  }

  /**
   * Returns a promise that resolves with an observable that provides a stream of all shifts in an organisation
   */
  getAllShifts() {
    return new Promise((resolve) => {
      this.userService.getOrganisation().then((org) => {
        resolve(this.fireDb.collection('organisation/' + org['orgId'] + '/shifts').valueChanges());
      });
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
      const tmpShift = Object.assign({}, newShift);
      tmpShift.shiftId = this.fireDb.createId();
      this.fireDb.collection(this.shiftRef).doc(tmpShift.shiftId).set(tmpShift).then(() => {
        // Add a reference to the shift for all related staff
        for (const uid in newShift.onDuty) {
          if (newShift.onDuty.hasOwnProperty(uid)) {
            const staffRef = this.fireDb.firestore.collection(this.staffRef).doc(uid);
            batch.update(staffRef, {
              shifts: firebase.firestore.FieldValue.arrayUnion(this.fireDb.collection(this.shiftRef).doc(tmpShift.shiftId).ref)
            });
          }
        }
        batch.commit().then(() => resolve()).catch((err) => reject(err));
      }).catch((err) => reject(err));
    });
  }

  /**
   * Update a shift entry in the database
   * @param updatedShift an updated shift entry
   */
  updateShift(updatedShift: Shift) {
    // const batch = this.fireDb.firestore.batch();

    return new Promise((resolve, reject) => {
      if (!updatedShift.onDuty) { reject('onDuty property missing from Shift'); }

      this.fireDb.collection(this.shiftRef).doc(updatedShift.shiftId).update(
        Object.assign({}, updatedShift)
      ).then((data) => {
        resolve();
        // Todo: Update rostered staff
        // batch.commit().then(() => resolve()).catch((err) => reject(err));
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
        if (stream) {
          resolve(shiftData);
          stream.unsubscribe();
        }
      });
    });
  }

  /**
   * Filter a list of shifts into pending, upcoming and total categories
   * @param shifts a list of shifts to filter
   */
  filterShifts(shifts: Shift[]) {
    if (!shifts) { return; }
    const pendingShifts = new Array<Shift>();
    const upcomingShifts = new Array<Shift>();
    const uid = this.userService.uid;
    shifts.forEach(aShift => {
      const status = aShift.getStatus(uid);
      if (status == null && !aShift.hasStarted()) {
        pendingShifts.push(aShift);
      } else if (status && !aShift.hasPassed()) {
        upcomingShifts.push(aShift);
      }
    });

    return {
      pending: pendingShifts,
      upcoming: upcomingShifts,
      total: shifts.slice()
    };
  }
}

