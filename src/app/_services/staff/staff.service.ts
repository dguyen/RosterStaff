import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireFunctions } from 'angularfire2/functions';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../user/user.service';
import { BehaviorSubject } from 'rxjs';

export class Staff {
  uid: string;
  firstName: string;
  lastName: string;
  role: string;
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

  constructor(
    public userService: UserService,
    public fireDb: AngularFirestore,
    public fireAuth: AngularFireAuth,
    private fireFunc: AngularFireFunctions
  ) {
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
   * Create a new staff member in the same organisation as the logged in user
   * Returns a promise that resolves if a new staff member is successfully created, rejects otherwise
   * @param newStaff a staff member to be created
   */
  createStaff(newStaff: Staff) {
    return this.fireFunc.httpsCallable('createStaff')(newStaff).toPromise();
  }

  /**
   * Delete a staff member in the same organisation as the logged in user
   * Returns a promise that resolves when the staff member is deleted from the organisation or rejects when an error occurs
   * @param delStaff a staff member to be deleted
   */
  deleteStaff(staffUid: string) {
    return this.fireFunc.httpsCallable('deleteStaff')({ uid: staffUid }).toPromise();
  }

  /**
   * Update a staff member
   * @param updatedStaff an updated staff member
   */
  updateStaff(updatedStaff: Staff) {
    if (!updatedStaff) { return; }
    const objStaff = Object.assign({}, updatedStaff);
    if (objStaff.email) {
      delete objStaff.email;
    }
    return this.fireDb.collection(this.staffRef).doc(objStaff.uid).update(objStaff);
  }
}
