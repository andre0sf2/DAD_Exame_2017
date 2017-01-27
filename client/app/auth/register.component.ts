/**
 * Created by joao on 16-01-2017.
 */

import {Component} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from "@angular/router";
import {User} from "../model/user";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { ImageResult, ResizeOptions } from 'ng2-imageupload';

@Component({
    moduleId: module.id,
    selector: 'register',
    templateUrl: 'register.component.html',
    styleUrls: ['auth.component.css']
})
export class RegisterComponent {
    private registerForm: FormGroup;

    protected _user = new User('', '', '', '', '');
    protected _formSubmitted = false;
    errorMessage = '';
    src = "";

    protected usernameTaken: boolean;

    protected error: boolean;

    constructor(formBuilder: FormBuilder, private router: Router, private auth: AuthService) {
        const usernameRegex = '^[a-zA-Z0-9]+$';
        const emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

        this.registerForm = formBuilder.group({
            'username': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(usernameRegex)])],
            'email': [null, Validators.compose([Validators.required, Validators.pattern((emailRegex))])],
            'password': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
            'passwordConfirmation': [null, Validators.compose([Validators.required])],
            'picture': [null]
        });
    }

    register() {

        if (this._user.password !== this._user.passwordConfirmation) {
            this.errorMessage = 'Password mismatch';
            this.error = true;
            return;
        }

        this._formSubmitted = true;

        if(this._user.profilePic != this.src){
            this._user.profilePic = '../../img/photo4.png';
        }

        console.log(this._user.profilePic );

        this.auth
            .register(this._user)
            .then(res => {
                if (res['msg'] === 'username already exists') {
                    this.errorMessage = 'Username already exists';
                    this.error = true;
                    this._formSubmitted = false;
                } else {
                    if (this._user.password !== this._user.passwordConfirmation) {
                        this.registerForm.setErrors({'passwordMissmatch': 'Password and Password Confirmation must match.'})
                    } else {
                        this.gotoLogin();
                    }

                }
            });
    }

    authFacebook() {
        this.auth.facebook();
    }

    gotoLogin() {
        this.router.navigateByUrl('/login').then(/*Do Nothing*/);
    }

    goBack() {
        this.router.navigateByUrl('').then(/*Do Nothing*/);
    }

    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 178,
        resizeMaxWidth: 178
    };

    selected(imageResult: ImageResult) {
        this.src = imageResult.resized && imageResult.resized.dataURL || imageResult.dataURL;
        this._user.profilePic = this.src;
        console.log("Imagem: "+ this.src);
    }


}