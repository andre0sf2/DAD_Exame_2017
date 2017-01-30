/**
 * Created by magalhaes on 25/01/2017.
 */
import {Component} from '@angular/core';
import {AuthService} from "../services/auth.service";


@Component({
    moduleId: module.id,
    selector: 'social',
    templateUrl: 'auth.component.html',
    styleUrls: ['social.css']
})
export class AuthComponent {

    constructor(private auth: AuthService) {

    }

    google() {

    }

}