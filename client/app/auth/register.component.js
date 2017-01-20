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
var auth_service_1 = require('../services/auth.service');
var router_1 = require("@angular/router");
var user_1 = require("../model/user");
var RegisterComponent = (function () {
    function RegisterComponent(router, auth) {
        this.router = router;
        this.auth = auth;
        this._user = new user_1.User(null, '', '', '', 0, 0, '', '');
        this._formSubmitted = false;
    }
    RegisterComponent.prototype.register = function () {
        var _this = this;
        this._formSubmitted = true;
        this.auth
            .register(this._user)
            .then(function (res) {
            console.log("REGISTOU: " + res);
            _this.goToLogin();
        })
            .catch(function (e) {
            _this.error = true;
            console.log("ERRO: " + e);
        });
    };
    RegisterComponent.prototype.goBack = function () {
        this.router.navigateByUrl('').then();
    };
    RegisterComponent.prototype.goToLogin = function () {
        this.router.navigateByUrl('/login').then();
    };
    RegisterComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'register',
            templateUrl: 'register.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.Router, auth_service_1.AuthService])
    ], RegisterComponent);
    return RegisterComponent;
}());
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map