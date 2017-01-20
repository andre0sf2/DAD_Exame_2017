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
var Rx_1 = require("rxjs/Rx");
var http_1 = require("@angular/http");
var Top10Service = (function () {
    function Top10Service(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        this.bestPlayers = [];
    }
    Top10Service.prototype.getTop10byStars = function () {
        var _this = this;
        return this.http.get('http://localhost:7777/api/v1/top/stars')
            .map(function (data) {
            _this.bestPlayers = data.json();
            return _this.bestPlayers;
        })
            .catch(function (erro) {
            console.log(erro);
            return Rx_1.Observable.throw(erro);
        });
    };
    Top10Service.prototype.getTop10byPoints = function () {
        var _this = this;
        return this.http.get('http://localhost:7777/api/v1/top/points')
            .map(function (data) {
            _this.bestPlayers = data.json();
            return _this.bestPlayers;
        })
            .catch(function (erro) {
            console.log(erro);
            return Rx_1.Observable.throw(erro);
        });
    };
    return Top10Service;
}());
Top10Service = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], Top10Service);
exports.Top10Service = Top10Service;
//# sourceMappingURL=top10.service.js.map