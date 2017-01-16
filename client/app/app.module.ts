import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./auth/login.component";
import {RegisterComponent} from "./auth/register.component";

import {AuthService} from "./services/auth.service";


@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent, HomeComponent, LoginComponent, RegisterComponent ],
  providers: [ AuthService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
