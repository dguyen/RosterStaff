import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Subject, Subscription } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

class Profile {
  firstName: '';
  lastName: '';
  email: '';
  phoneNum: '';
  role: string;
  address = '';
  shifts = [];
  isReady = false;
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
  profileSubscription: Subscription;
  org = new Organisation;
  uid = '';

  constructor(private fireAuth: AngularFireAuth, private fireDb: AngularFirestore, private fireStg: AngularFireStorage) {
    fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;

        // Get organisation and load user data
        const toUnsub = fireDb.collection('users').doc(user.uid).valueChanges().subscribe((doc) => {
          if (doc['organisation'].id) {
            this.loadUserData(doc['organisation'].id).then(() => {
              this.org.isReady = true;
              this.dataStream.next('orgLoaded');
            });
          } else {
            throw Error('User missing organisation data');
          }
          toUnsub.unsubscribe();
        });
      } else {
        // Reset data
        this.profile = new Profile;
        this.uid = '';
        this.org = new Organisation;
        if (this.profileSubscription) {
          this.profileSubscription.unsubscribe();
        }
      }
    });
  }

  /**
   * Update the signed in user's profile
   * @param updatedProfile the updated profile
   */
  updateProfile(updatedProfile: Profile) {
    if (!this.profile.isReady) {
      throw Error('Service is not yet configured');
    }
    // Todo: Replace with firebase function for security reasons
    return this.fireDb.collection('organisation/' + this.org.orgId + '/staff').doc(this.uid).update(updatedProfile);
  }

  /**
   * Returns a promise that resolves with the organisation
   */
  getOrganisation() {
    return new Promise((resolve) => {
      if (this.org.isReady) {
        resolve(this.org);
        return;
      }
      const tmp = this.dataStream.subscribe((stream) => {
        if (stream === 'orgLoaded') {
          resolve(this.org);
          tmp.unsubscribe();
          return;
        }
      });
    });
  }

  /**
   * Returns a promise that resolves with the user's roles
   */
  getRoles() {
    return new Promise((resolve) => {
      if (this.profile.isReady) {
        resolve(this.profile.role);
        return;
      }
      const tmp = this.dataStream.subscribe((data) => {
        if (data === 'profileLoaded') {
          resolve(this.profile.role);
          tmp.unsubscribe();
          return;
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
      this.profileSubscription = this.fireDb.collection(staffRef).doc(this.uid).valueChanges().subscribe((doc: Profile) => {
        this.profile = doc;
        this.profile.isReady = true;
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
      const toUnsub = this.fireDb.collection('organisation').doc(organisation).valueChanges().subscribe((doc) => {
        if (!doc['name']) {
          reject('Unable to find organisation');
        }
        this.org.orgId = organisation;
        this.org.selectedOrg = doc['name'];
        resolve();
        toUnsub.unsubscribe();
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

  /**
   * Update the logged in user's profile picture
   * @param picture an image file to upload
   */
  updateProfilePicture(picture: File) {
    if (!this.fireAuth.auth.currentUser) {
      throw new Error('User not signed in');
    }
    return new Promise((resolve, reject) => {
      if (picture.size >= 3 * 1024 * 1024) {
        reject('storage/max_file_size');
        return;
      }

      const user = this.fireAuth.auth.currentUser.uid;
      this.fireStg.ref(user + '/profile/picture').put(picture).then((data) => {
        if (data.state !== 'success') {
          reject();
          return;
        }
        data.ref.getDownloadURL().then((url) => {
          this.fireAuth.auth.currentUser.updateProfile({
            displayName: '',
            photoURL: url
          }).then(() => resolve()).catch((err) => reject(err.code));
        });
      }).catch((err) => reject(err.code));
    });
  }

  /**
   * Delete user's profile picture
   */
  deleteProfilePicture() {
    if (!this.fireAuth.auth.currentUser) {
      throw new Error('User not signed in');
    }
    return new Promise((resolve, reject) => {
      if (!this.fireAuth.auth.currentUser.photoURL) {
        resolve();
        return;
      }
      const user = this.fireAuth.auth.currentUser.uid;
      const deletePromise = new Promise((resolveDelete) => {
        this.fireStg.ref(user + '/profile/picture').delete().toPromise().then(() => {
          resolveDelete();
        }).catch(() => resolveDelete());
      });
      const updateUrlPromise = this.fireAuth.auth.currentUser.updateProfile({
        displayName: '',
        photoURL: null
      });

      Promise.all([deletePromise, updateUrlPromise]).then(() => {
        resolve();
      }).catch((err) => reject(err));
    });
  }

  /**
   * Returns the url of the user's profile picture if exists, otherwise returns null
   */
  getProfilePicture() {
    const user = this.fireAuth.auth.currentUser;
    if (!user) {
      throw new Error('User is not signed in yet');
    }
    return user.photoURL ? user.photoURL : null;
  }
}
