import { NgModule } from '@angular/core';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './_guards/auth-guard.service'; 

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { SharedModule } from './shared.module';

import firebase from '@firebase/app';
import '@firebase/auth';

firebase.initializeApp(environment.firebaseConfig);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    SharedModule,
    AppRoutingModule
  ],
  providers: [ AuthGuard ],
  bootstrap: [AppComponent]
})
export class AppModule { }
