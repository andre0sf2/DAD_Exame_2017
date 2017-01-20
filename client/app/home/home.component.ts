/**
 * Created by joao on 16-01-2017.
 */

import {Component} from '@angular/core';
import {AuthService} from '../services/auth.service';



@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})


export class HomeComponent {
    constructor(private auth: AuthService) {

    }
}
