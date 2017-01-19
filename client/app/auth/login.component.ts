/**
 * Created by joao on 16-01-2017.
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import {User} from "../model/user";


@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: 'login.component.html'
})

export class LoginComponent {

    user = new User(0, '', '', '', 0, 0, '', '');

    constructor(private authService: AuthService, private router: Router) { }



}




