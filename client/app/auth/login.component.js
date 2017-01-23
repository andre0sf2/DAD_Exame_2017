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
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var auth_service_1 = require("../services/auth.service");
var forms_1 = require("@angular/forms");
var LoginComponent = (function () {
    function LoginComponent(formBuilder, router, auth) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.auth = auth;
        this.error = false;
        this.loggedIn = false;
        var usernameRegex = '^[a-zA-Z0-9]+$';
        this.loginForm = formBuilder.group({
            'username': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern(usernameRegex)])],
            'password': [null, forms_1.Validators.compose([forms_1.Validators.required])]
        });
    }
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.auth
            .login({ username: this._username, password: this._password })
            .subscribe(function (res) {
            if (res) {
                _this.loggedIn = true;
                _this.error = false;
                console.log(_this.auth
                    .login(res));
                setTimeout(function () {
                    _this.goBack();
                }, 1000);
            }
            else {
                _this.error = true;
            }
        });
    };
    LoginComponent.prototype.goBack = function () {
        this.router.navigateByUrl('/home');
    };
    LoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'login',
            templateUrl: 'login.component.html'
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder, router_1.Router, auth_service_1.AuthService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map