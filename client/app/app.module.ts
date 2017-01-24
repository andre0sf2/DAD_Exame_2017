import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./auth/login.component";
import {RegisterComponent} from "./auth/register.component";
import {Top10Component} from "./game/top10.component";
import {LobbyComponent} from "./home/lobby.component";
import {TableComponent} from './game/table.component';
import { HistoryComponent } from './history/history.component';

import {RouterModule} from "@angular/router";
import {Top10Service} from "./services/top10.service";
import {GameService} from "./services/game.service";


import { AppRoutingModule }     from './app-routing.module';
import {APP_BASE_HREF} from "@angular/common";
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserService} from "./services/user.service";
import {AuthService} from "./services/auth.service";
import {ChatComponent} from "./chat/chat.component";
import {WebSocketService} from "./services/websocket.service";

@NgModule({
  imports:      [ BrowserModule, RouterModule, AppRoutingModule, HttpModule, FormsModule, ReactiveFormsModule],
  declarations: [ AppComponent, HomeComponent, ChatComponent, HistoryComponent, LoginComponent, RegisterComponent, Top10Component, LobbyComponent, TableComponent],
  providers:    [ WebSocketService, Top10Service, AuthService, GameService, UserService, { provide: APP_BASE_HREF, useValue: '/' } ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
