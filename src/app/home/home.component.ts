import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private fireAuth: AngularFireAuth) {
    // console.log(fireAuth.auth.currentUser.email);
  }

  ngOnInit() {
  }

}
