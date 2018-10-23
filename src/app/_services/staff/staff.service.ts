import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../user/user.service';
import { BehaviorSubject } from 'rxjs';

export class Staff {
  uid: string;
  firstName: string;
  lastName: string;
  roles: string[];
  shifts: string[];
  phoneNum: number;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private staffObservable;
  private staffRef;
  organisation: String;
  staffMembers: Staff[];
  staffStream = new BehaviorSubject<Staff[]>(this.staffMembers);

  constructor(public userService: UserService, public fireDb: AngularFirestore, public fireAuth: AngularFireAuth) {
    fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userService.getOrganisation().then((org) => {
          this.organisation = org['orgId'];
          this.staffRef = 'organisation/' + this.organisation + '/staff';
          this.staffListener();
        });
      } else {
        this.staffStream = new BehaviorSubject<Staff[]>(this.staffMembers);
        this.staffObservable.unsubscribe();
        this.organisation = null;
        this.staffMembers = null;
      }
    });
  }

  private staffListener() {
    this.staffObservable = this.fireDb.collection(this.staffRef).snapshotChanges().subscribe((data) => {
      const tmpArray = Array<Staff>();
      data.forEach(staffMember => {
        const tmpStaff = Object.assign(new Staff, staffMember.payload.doc.data());
        tmpStaff.uid = staffMember.payload.doc.id;
        tmpArray.push(tmpStaff);
      });
      this.staffMembers = tmpArray;
      this.staffStream.next(this.staffMembers);
    });
  }

  /**
   * Retrieve all staff members in organisation
   */
  getAllStaff() {
    return new Promise((resolve) => {
      if (!this.staffMembers) {
        const tmpRef = this.staffStream.subscribe((staff) => {
          if (staff) {
            resolve(staff);
            tmpRef.unsubscribe();
            return;
          }
        });
      } else {
        resolve(this.staffMembers);
      }
    });
  }

  /**
   * Retrieve a staff member
   * @param uid a string representing the id of the staff member
   */
  getStaff(uid: string) {
    return new Promise((resolve, reject) => {
      const tmpStream = this.staffStream.subscribe((staffMembers) => {
        if (staffMembers && tmpStream) {
          const tmp = staffMembers.filter((staff) => staff.uid === uid);
          tmp.length === 1 ? resolve(tmp[0]) : reject();
          tmpStream.unsubscribe();
        }
      });
    });
  }

  /**
   * Create a new staff member
   * @param newStaff a staff member to be created
   */
  createStaff(newStaff: Staff) {
    // Todo: Required to use firebase functions and admin sdk for security reasons
  }

  /**
   * Delete a staff member from the organisation
   * @param delStaff a staff member to be deleted
   */
  deleteStaff(delStaff: Staff) {
    // Todo: Required to use firebase functions and admin sdk for security reasons
  }

  /**
   * Update a staff member
   * @param updatedStaff an updated staff member
   */
  updateStaff(updatedStaff: Staff) {
    if (!updatedStaff) { return; }
    const objStaff = Object.assign({}, updatedStaff);
    return this.fireDb.collection(this.staffRef).doc(updatedStaff.uid).update(objStaff);
  }
}
