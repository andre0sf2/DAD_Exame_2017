/**
 * Created by joao on 18-01-2017.
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
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/observable/throw");
var url = 'http://localhost:7777/api/v1/';
var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
    }
    AuthService.prototype.login = function (user) {
        var _this = this;
        var options = this.buildHeaders();
        return this.http.post(url + 'login', user, options)
            .map(function (res) {
            localStorage.setItem('user', JSON.stringify(res.json()));
            return _this.getCurrentUser();
        })
            .catch(function (e) {
            console.log(e);
            return Rx_1.Observable.of(null);
        });
    };
    AuthService.prototype.logout = function () {
        var options = this.buildHeadersWithAuthorization();
        return this.http.post('http://localhost:7777/api/v1/logout', null, { headers: options })
            .map(function (res) {
            res.json();
            localStorage.removeItem('user');
        })
            .catch(function (e) {
            console.log(e);
            return Rx_1.Observable.throw(e);
        });
    };
    AuthService.prototype.register = function (user) {
        var options = this.buildHeaders();
        return this.http
            .post(url + 'register', user, options)
            .toPromise()
            .then(function (r) { return Promise.resolve(r.json()); })
            .catch(function (r) { return Promise.resolve({ error: true, message: 'internal error' }); });
    };
    AuthService.prototype.isLogged = function () {
        return this.getCurrentUser() != null ? true : false;
    };
    AuthService.prototype.getCurrentUser = function () {
        return JSON.parse(localStorage.getItem('user'));
    };
    AuthService.prototype.buildHeaders = function () {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        return headers;
    };
    AuthService.prototype.buildHeadersWithAuthorization = function () {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Authorization', 'Bearer ' + this.getCurrentUser().token);
        return headers;
    };
    AuthService.prototype.facebook = function () {
        return this.http
            .get(url + 'auth/facebook')
            .toPromise()
            .then(function (r) { return Promise.resolve(r.json()); })
            .catch(function (r) { return Promise.resolve({ error: true, message: 'Internal error, try again later.' }); });
    };
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map