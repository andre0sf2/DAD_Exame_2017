import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";


@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(private auth: AuthService, private router: Router) {
    }

    logout(): void {
        this.auth.logout().subscribe();
    }

    profile(): void{
        this.router.navigateByUrl('/profile/'+ this.auth.getCurrentUser()._id);
    }
}
