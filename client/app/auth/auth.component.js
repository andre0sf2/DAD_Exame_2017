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
/**
 * Created by magalhaes on 25/01/2017.
 */
var core_1 = require("@angular/core");
var auth_service_1 = require("../services/auth.service");
var AuthComponent = (function () {
    function AuthComponent(auth) {
        this.auth = auth;
    }
    AuthComponent.prototype.facebook = function () {
    };
    AuthComponent.prototype.twitter = function () {
    };
    AuthComponent.prototype.google = function () {
    };
    return AuthComponent;
}());
AuthComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'social',
        templateUrl: 'auth.component.html',
        styleUrls: ['social.css']
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthComponent);
exports.AuthComponent = AuthComponent;
//# sourceMappingURL=auth.component.js.map