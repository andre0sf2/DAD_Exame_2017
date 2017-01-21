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
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var GameService = (function () {
    function GameService(http) {
        this.http = http;
    }
    GameService.prototype.findMyGames = function (user) {
        var headers = this.createHeaders(user.token);
        var myGames = [];
        return this.http.get('http://localhost:7777/api/v1/games', headers)
            .map(function (resource) {
            resource.json().forEach(function (game) {
                if (game.UserOwner == user._id.toString()) {
                    myGames.push(game);
                }
            });
            return myGames;
        })
            .catch(function (error) {
            return Rx_1.Observable.throw(error);
        });
    };
    GameService.prototype.findOtherGames = function (user) {
        var headers = this.createHeaders(user.token);
        var otherGames = [];
        return this.http.get('http://localhost:7777/api/v1/games', headers)
            .map(function (resource) {
            resource.json().forEach(function (game) {
                if (game.UserOwner != user._id.toString() && game.status == 'on lobby') {
                    otherGames.push(game);
                }
            });
            return otherGames;
        })
            .catch(function (error) {
            return Rx_1.Observable.throw(error);
        });
    };
    GameService.prototype.createGame = function (user) {
        var headers = this.createHeaders(user.token);
        console.log(user._id);
        return this.http.post('http://localhost:7777/api/v1/games', {
            UserOwner: user._id,
            UsernameOwner: user.username,
            finish: '',
            status: 'on lobby',
            nplayers: 1,
            players: [{
                    player: user._id,
                    points: 0
                }]
        }, headers)
            .map(function (resource) {
            return resource.json();
        })
            .catch(function (error) {
            return Rx_1.Observable.throw(error);
        });
    };
    GameService.prototype.deleteGame = function (game, user) {
        var headers = this.createHeaders(user.token);
        return this.http.delete('http://localhost:7777/api/v1/games/' + game._id, headers)
            .map(function (response) {
            return response.json();
        })
            .catch(function (error) {
            return Rx_1.Observable.throw(error);
        });
    };
    GameService.prototype.updateGame = function (game, user) {
        var headers = this.createHeaders(user.token);
        return this.http.put('http://localhost:7777/api/v1/games/' + game._id, JSON.stringify(game), headers)
            .map(function (response) {
            return response.json();
        })
            .catch(function (error) {
            return Rx_1.Observable.throw(error);
        });
    };
    GameService.prototype.createHeaders = function (token) {
        var headers = new http_1.Headers();
        headers.append('Authorization', 'bearer ' + token);
        headers.append('Content-Type', 'application/json');
        return new http_1.RequestOptions({ headers: headers });
    };
    return GameService;
}());
GameService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map