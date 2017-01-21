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

    protected _user = new User(null, '', '', '', 0, 0, '', '');
    protected _formSubmitted = false;
    errorMessage = '';

    protected usernameTaken: boolean;

    protected error: boolean;

    constructor(private router: Router, private auth: AuthService) {
    }

    register() {

        if(this._user.password !== this._user.passwordConfirmation){
            this.errorMessage = 'Password mismatch';
            this.error = true;
            return;
        }

        this._formSubmitted = true;

        this.auth
            .register(this._user)
            .then(res => {
                if (res['msg'] === 'username already exists') {
                    this.errorMessage = 'Username already exists'
                    this.error = true;
                    this._formSubmitted = false;
                } else {
                    console.log("REGISTOU: " + res);
                    this.auth.login({username: this._user.username, password: this._user.password}).subscribe(r =>{ console.log(r)})
                    setTimeout(() => {
                        this.goBack();
                    }, 1000);
                }
            })
            .catch(e => {
                this.error = true;
                console.log("ERRO: " + e);

            })
    }

    goBack() {
        this.router.navigateByUrl('').then(/*Do Nothing*/);
    }

}
