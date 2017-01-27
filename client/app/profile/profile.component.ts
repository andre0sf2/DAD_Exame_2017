import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";



@Component({
    moduleId: module.id,
    templateUrl: 'profile.component.html'
})
export class ProfileComponent{
    constructor(private auth: AuthService) {
        console.log(this.user.profilePic);
    }

    public user = this.auth.getCurrentUser();



}