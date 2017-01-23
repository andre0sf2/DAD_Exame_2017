/**
 * Created by joao on 16-01-2017.
 */

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }   from './auth/login.component';
import { HomeComponent }   from './home/home.component';
import { RegisterComponent }   from './auth/register.component';
import {AppComponent} from "./app.component";
import {AuthService} from "./services/auth.service";
import {TableComponent} from './game/table.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home',  component: HomeComponent },
    { path: 'login',  component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'table-game/:room', component: TableComponent },
    { path: 'history', component: HistoryComponent}
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */