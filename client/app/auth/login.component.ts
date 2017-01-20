/**
 * Created by joao on 16-01-2017.
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {AuthService} from "../services/auth.service";


@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: 'login.component.html'
})

export class LoginComponent {


    _username: string;
    _password: string;

    constructor(private router: Router, private auth: AuthService) { }

    login(): void {
        this.auth
            .login({username: this._username, password: this._password})
            .toPromise()
            .then(res => {
                this.goBack();
            });
    }

    goBack() {
        this.router.navigateByUrl('').then(/*Do Nothing*/);
    }

}




