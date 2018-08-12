import { Component, OnInit, NgModule } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../_services/auth/auth.service';
import firebase from '@firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string = "";
  password: string = "";
  showLoading: boolean = false;
  keepSignedIn: boolean = false;
  
  constructor(private authService: AuthService, private router: Router) {
    authService.isAuthenticatedPromise().then(() => {
      this.router.navigate(['staff']);
    })
  }

  ngOnInit() {
  }

  login() {
    this.showLoading = true;

    let session = this.keepSignedIn ? 
      firebase.auth.Auth.Persistence.LOCAL : 
      firebase.auth.Auth.Persistence.SESSION;
      
    this.authService.getAuth().setPersistence(session).then(() => {
      this.authService.signIn(this.email, this.password).then(() => {
        this.router.navigate(['staff']);
      }).catch((err) => {
        this.showLoading = false;
        if (err.code == "auth/wrong-password") {
          // Todo: Form validation
        }
        else if (err.code == "auth/invalid-email") {
          // Todo: Form validation
        }
      })
    }).catch((err) => {
      this.showLoading = false;
      console.log(err);
    })
  }
}
