/**
 * Created by joao on 16-01-2017.
 */

import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from "../services/auth.service";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";


@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: 'login.component.html'
})

export class LoginComponent {
    private loginForm: FormGroup;

    error: boolean = false;
    loggedIn: boolean = false;

    _username: string;
    _password: string;

    constructor(private formBuilder: FormBuilder, private router: Router, private auth: AuthService) {
        const usernameRegex = '^[a-zA-Z0-9]+$';

        this.loginForm = formBuilder.group({
            'username': [null, Validators.compose([Validators.required, Validators.pattern(usernameRegex)])],
            'password': [null, Validators.compose([Validators.required])]
        });
    }

    login(): void {
        this.auth
            .login({username: this._username, password: this._password})
            .subscribe(res => {
                if (res) {
                    this.loggedIn = true;
                    this.error = false;
                    console.log(this.auth
                        .login(res));
                    setTimeout(() => {
                        this.goBack();
                    }, 1000);

                } else {
                    this.error = true;
                }
            });

    }

    goBack(): void {
        this.router.navigateByUrl('/home');
    }

}




