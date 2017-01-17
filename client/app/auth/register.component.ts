/**
 * Created by joao on 16-01-2017.
 */

import {Component} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from "@angular/router";
import {User} from "../model/user";

@Component({
    moduleId: module.id,
    selector: 'register',
    templateUrl: 'register.component.html'
})


export class RegisterComponent {
    user = new User(0, '', '', '', '', '');

    constructor(private auth: AuthService, private router: Router) {
    }

    register() {
        if (this.user.password !== this.user.passwordConfirmation) {

            return;
        }

        this.auth.register(this.user.username, this.user.password, this.user.email).subscribe(res => {
            console.log("username: " + this.user.username + " password: " + this.user.password);
           // this.auth.login(this.user.username, this.user.password).subscribe(r => console.log(r));

        });
    }
}
