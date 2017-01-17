/**
 * Created by joao on 16-01-2017.
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';


@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: 'login.component.html'
})

export class LoginComponent {


    constructor(private authService: AuthService, private router: Router) { }

    

}




