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
var auth_service_1 = require("../services/auth.service");
var router_1 = require("@angular/router");
var user_1 = require("../model/user");
var forms_1 = require("@angular/forms");
var RegisterComponent = (function () {
    function RegisterComponent(formBuilder, router, auth) {
        this.router = router;
        this.auth = auth;
        this._user = new user_1.User('', '', '', '', '');
        this._formSubmitted = false;
        this.errorMessage = '';
        var usernameRegex = '^[a-zA-Z0-9]+$';
        var emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
        this.registerForm = formBuilder.group({
            'username': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(3), forms_1.Validators.maxLength(50), forms_1.Validators.pattern(usernameRegex)])],
            'email': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern((emailRegex))])],
            'password': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(3), forms_1.Validators.maxLength(50)])],
            'passwordConfirmation': [null, forms_1.Validators.compose([forms_1.Validators.required])]
        });
    }
    RegisterComponent.prototype.register = function () {
        var _this = this;
        if (this._user.password !== this._user.passwordConfirmation) {
            this.errorMessage = 'Password mismatch';
            this.error = true;
            return;
        }
        this._formSubmitted = true;
        this.auth
            .register(this._user)
            .then(function (res) {
            if (res['msg'] === 'username already exists') {
                _this.errorMessage = 'Username already exists';
                _this.error = true;
                _this._formSubmitted = false;
            }
            else {
                if (_this._user.password !== _this._user.passwordConfirmation) {
                    _this.registerForm.setErrors({ 'passwordMissmatch': 'Password and Password Confirmation must match.' });
                }
                else {
                    _this.auth.login({ username: _this._user.username, password: _this._user.password });
                }
            }
        });
    };
    RegisterComponent.prototype.authFacebook = function () {
        this.auth.facebook();
    };
    RegisterComponent.prototype.gotoLogin = function () {
        this.router.navigateByUrl('/login').then();
    };
    RegisterComponent.prototype.goBack = function () {
        this.router.navigateByUrl('').then();
    };
    return RegisterComponent;
}());
RegisterComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'register',
        templateUrl: 'register.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder, router_1.Router, auth_service_1.AuthService])
], RegisterComponent);
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map