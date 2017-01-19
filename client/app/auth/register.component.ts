/**
 * Created by joao on 16-01-2017.
 */

import {Component} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from "@angular/router";
import {User} from "../model/user";
import {UserService} from "../services/user.service";
import {error} from "util";

@Component({
    moduleId: module.id,
    selector: 'register',
    templateUrl: 'register.component.html'
})


export class RegisterComponent {
<<<<<<< HEAD
    user = new User(0, '', '', '', 0, 0, '', '');
=======
>>>>>>> adeea102a9fcc5a5590383815de404e7c4487c39

    protected _user = new User(null, '', '', '', '', '');
    protected _formSubmitted = false;

    protected usernameTaken: boolean;

    protected error: boolean;

    constructor(private router: Router, private auth: AuthService) {
    }

    register() {
        this._formSubmitted = true;

        this.auth
            .register(this._user)
            .then(res => {
                    console.log("REGISTOU: " + res);
                    this.goToLogin();
            })
            .catch(e => {
                this.error = true;
                console.log("ERRO: " + e);

            })
    }

    goBack() {
        this.router.navigateByUrl('').then(/*Do Nothing*/);
    }

    goToLogin() {
        this.router.navigateByUrl('/login').then(/*Do Nothing*/);
    }
}
