import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

class Profile {
  firstName: '';
  lastName: '';
  role: string;
  shifts = [];
  isLoaded = false;
}

class Organisation {
  isReady: Boolean = false;
  selectedOrg: String = 'Company';
  orgId: String = null;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  dataStream = new Subject();
  profile = new Profile;
  org = new Organisation;
  uid = '';

  constructor(private fireAuth: AngularFireAuth, private fireDb: AngularFirestore) {
    fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;

        // Get organisation and load user data
        fireDb.collection('users').doc(user.uid).valueChanges().subscribe((doc) => {
          if (doc['organisation'].id) {
            this.loadUserData(doc['organisation'].id).then(() => {
              this.org.isReady = true;
            });
          } else {
            throw Error('User missing organisation data');
          }
        });
      } else {
        // Reset data
        this.profile = new Profile;
        this.uid = '';
        this.org = new Organisation;
      }
    });
  }

  /**
   * Returns a promise that resolves with the user's roles
   */
  getRoles() {
    return new Promise((resolve, reject) => {
      if (this.profile.isLoaded) {
        resolve(this.profile.role);
        return;
      }
      this.dataStream.subscribe((data) => {
        if (data === 'profileLoaded') {
          resolve(this.profile.role);
        }
      });
    });
  }

  /**
   * Obtains the required data of a user from their registered organisation.
   * @param organisation a string representing the id of an organisation
   */
  loadUserData(organisation: string) {
    return Promise.all([this.getOrgData(organisation), this.getProfile(organisation)]);
  }

  /**
   * Retrieve the profile of a user stored within an organisation
   * @param organisation a string representing the id of an organisation
   */
  private getProfile(organisation: string) {
    const staffRef = 'organisation/' + organisation + '/staff';
    return new Promise((resolve, reject) => {
      this.fireDb.collection(staffRef).doc(this.uid).valueChanges().subscribe((doc: Profile) => {
        this.profile = doc;
        this.profile.isLoaded = true;
        this.dataStream.next('profileLoaded');
        resolve();
      });
    });
  }

  /**
   * Retrieve the real organisation name from the organisation id
   * @param organisation a string representing the id of an organisation
   */
  private getOrgData(organisation: string) {
    return new Promise((resolve, reject) => {
      this.fireDb.collection('organisation').doc(organisation).valueChanges().subscribe((doc) => {
        if (!doc['name']) {
          reject('Unable to find organisation');
        }
        this.org.orgId = organisation;
        this.org.selectedOrg = doc['name'];
        resolve();
      }, (err) => reject(err));
    });
  }

  /**
   * Returns the full name of the user. If the user data has yet to be retrieved, it will return an empty string.
   */
  getFullName() {
    return this.profile ? this.profile.firstName + ' ' + this.profile.lastName : '';
  }

  /**
   * Reauthenticate signed in user
   * @param password a string representing the password of the user currently logged in
   */
  reauthenticateUser(password: string) {
    const credential = firebase.auth.EmailAuthProvider.credential(
      this.fireAuth.auth.currentUser.email,
      password
    );

    return new Promise((resolve, reject) => {
      if (!this.fireAuth.auth.currentUser) { reject(); }
      this.fireAuth.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
