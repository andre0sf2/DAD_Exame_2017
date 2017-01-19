import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./auth/login.component";
import {RegisterComponent} from "./auth/register.component";
import {Top10Component} from "./game/top10.component";


import {AuthService} from "./services/auth.service";
import {RouterModule} from "@angular/router";
import {Top10Service} from "./services/top10.service";


import { AppRoutingModule }     from './app-routing.module';
import {APP_BASE_HREF} from "@angular/common";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports:      [ BrowserModule, RouterModule, AppRoutingModule, HttpModule, FormsModule],
  declarations: [ AppComponent, HomeComponent, LoginComponent, RegisterComponent, Top10Component ],
  providers: [Top10Service, AuthService, { provide: APP_BASE_HREF, useValue: '/' } ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
