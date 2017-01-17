/**
 * Created by joao on 16-01-2017.
 */

import {Component} from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: 'login.component.html'
})


export class LoginComponent {
    constructor(private auth: AuthService) {
    }


}
