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
var UserService = (function () {
    function UserService(http) {
        this.http = http;
        this.url = 'http://localhost:7777/api/v1/';
    }
    UserService.prototype.getUserToLocalStorage = function (id, token) {
        this.http.get(this.url + 'users/' + id)
            .toPromise()
            .then(function (user) {
            localStorage.setItem('user', JSON.stringify(user.json()));
        })
            .catch(function (r) { return Promise.resolve({ error: true, message: 'Internal error, try again later.' }); });
    };
    UserService.prototype.buildHeadersWithAuthorization = function (token) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        return headers;
    };
    return UserService;
}());
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map