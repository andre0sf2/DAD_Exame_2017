import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./auth/login.component";
import {RegisterComponent} from "./auth/register.component";

import {AuthService} from "./services/auth.service";
import {RouterModule} from "@angular/router";

import { AppRoutingModule }     from './app-routing.module';
import {APP_BASE_HREF} from "@angular/common";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports:      [ BrowserModule, RouterModule, AppRoutingModule, HttpModule, FormsModule],
  declarations: [ AppComponent, HomeComponent, LoginComponent, RegisterComponent ],
  providers: [ AuthService, { provide: APP_BASE_HREF, useValue: '/' } ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
