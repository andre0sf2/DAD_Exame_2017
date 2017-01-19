/**
 * Created by joao on 16-01-2017.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var auth_service_1 = require("../services/auth.service");
<<<<<<< HEAD
var user_1 = require("../model/user");
=======
>>>>>>> adeea102a9fcc5a5590383815de404e7c4487c39
var LoginComponent = (function () {
    function LoginComponent(router, auth) {
        this.router = router;
<<<<<<< HEAD
        this.user = new user_1.User(0, '', '', '', 0, 0, '', '');
    }
=======
        this.auth = auth;
    }
    LoginComponent.prototype.login = function (username, password) {
        var _this = this;
        this.auth
            .login(username, password)
            .toPromise()
            .then(function (res) {
            _this.goBack();
        });
    };
    LoginComponent.prototype.goBack = function () {
        this.router.navigateByUrl('').then();
    };
>>>>>>> adeea102a9fcc5a5590383815de404e7c4487c39
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'login',
        templateUrl: 'login.component.html'
    }),
<<<<<<< HEAD
    __metadata("design:paramtypes", [auth_service_1.AuthService, router_1.Router])
=======
    __metadata("design:paramtypes", [router_1.Router, auth_service_1.AuthService])
>>>>>>> adeea102a9fcc5a5590383815de404e7c4487c39
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map