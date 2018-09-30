import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, Subscription, Subject } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

class Profile {
  firstName: '';
  lastName: '';
  roles = [];
  shifts = [];
  isLoaded = false;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  profile = new Profile;

  org = {
    listOfOrgs: [],
    isReady: false,
    selectedOrg: 'Company'
  };

  uid = '';
  fireDb: any;
  dataReady: any;
  dataStream = new Subject();

  constructor(private fireAuth: AngularFireAuth, fireDb: AngularFirestore) {
    this.fireDb = fireDb;

    fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;

        // Get organisations
        fireDb.collection('users').doc(user.uid).valueChanges().subscribe((doc) => {
          doc['organisations'].forEach(element => {
            this.org.listOfOrgs.push(element.id);
          });

          this.org.isReady = true;
          this.dataStream.next('user_orgs_loaded');

          // HARDCODED
          this.loadUserData('crystal-palace');
        });
      } else {
        // Reset data
        this.profile = new Profile;
        this.uid = '';
        this.org = {
          listOfOrgs: [],
          isReady: false,
          selectedOrg: 'Company'
        };
      }
    });
  }

  /**
   * Returns a promise that resolves with the user's roles
   */
  getRoles() {
    return new Promise((resolve, reject) => {
      if (this.profile.isLoaded) {
        resolve(this.profile.roles);
        return;
      }
      this.dataStream.subscribe((data) => {
        if (data === 'profile_loaded') {
          resolve(this.profile.roles);
        }
      });
    });
  }

  /**
   * Obtains the required data of a user based on a selected organisation.
   * @param organisation a string representing the id of an organisation
   */
  loadUserData(organisation: string) {
    if (!this.org.listOfOrgs.includes(organisation)) {
      return null;
    }
    this.dataReady = Promise.all([this.getOrgData(organisation), this.getProfile(organisation)]);
    return this.dataReady;
  }

  /**
   * Retrieve the profile of a user stored within an organisation
   * @param organisation a string representing the id of an organisation
   */
  private getProfile(organisation: string) {
    const staffRef = 'organisation/' + organisation + '/staff';

    return new Promise((resolve, reject) => {
      this.fireDb.collection(staffRef).doc(this.uid).valueChanges().subscribe((doc) => {
        this.profile = doc;
        this.profile.isLoaded = true;
        this.dataStream.next('profile_loaded');
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
      this.fireDb.collection('organisation').doc(organisation).valueChanges().subscribe(
        (doc) => {
          if (!doc.name) {
            reject('Unable to find organisation');
          }
          this.org.selectedOrg = doc.name;
          resolve();
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  /**
   * Returns the full name of the user. If the user data has yet to be retrieved, it will return an empty string.
   */
  getFullName() {
    if (this.profile) {
      return this.profile.firstName + ' ' + this.profile.lastName;
    }
    return '';
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
