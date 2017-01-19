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

<<<<<<< HEAD
    user = new User(0, '', '', '', 0, 0, '', '');
=======
    _username: string;
    _password: string;
>>>>>>> adeea102a9fcc5a5590383815de404e7c4487c39

    constructor(private router: Router, private auth: AuthService) { }

    login(username: string, password: string): void {
        this.auth
            .login(username, password)
            .toPromise()
            .then(res => {
                this.goBack();
            });
    }

    goBack() {
        this.router.navigateByUrl('').then(/*Do Nothing*/);
    }

}




