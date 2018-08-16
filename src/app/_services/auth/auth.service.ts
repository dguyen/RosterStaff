import { Injectable } from '@angular/core';

import firebase from '@firebase/app';
import '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: any;

  constructor() {
    this.auth = firebase.auth();
  }

  signIn(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    return this.auth.signOut();
  }

  isAuthenticated() {
    return this.auth.currentUser ? true : false;
  }

  isAuthenticatedPromise() {
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user || this.isAuthenticated()) {
          resolve(true);
          return;
        }
        resolve(false);
      });
    });
  }

  getAuth() {
    return this.auth;
  }

  resetEmail(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }
}
