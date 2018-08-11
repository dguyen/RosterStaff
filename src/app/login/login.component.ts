import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = "";
  password: string = "";
  showLoading: boolean = false;
  keepSignedIn: boolean = false;

  constructor(private fireAuth: AngularFireAuth, private router: Router) {
    if (this.fireAuth.user) this.router.navigate(['']);
  }

  ngOnInit() {
  }

  login() {
    // Todo: Persistent login
    // this.fireAuth.auth.setPersistence('local').then(() => {
    //   this.fireAuth.auth.signInWithEmailAndPassword(this.email, this.password).then(() => {
    //     this.router.navigate(['']);
    //   });
    // }).catch((err) => {
    //   console.log(err);
    // });

    this.showLoading = true;
    this.fireAuth.auth.signInWithEmailAndPassword(this.email, this.password)
    .then((data) => {
      this.router.navigate(['']);
    }).catch((err) => {
      this.showLoading = false;
      if (err.code == "auth/wrong-password") {
        // Todo: Form validation
      }
      else if (err.code == "auth/invalid-email") {
        // Todo: Form validation
      }
    })
  }
}
