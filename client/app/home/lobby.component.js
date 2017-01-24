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
var game_service_1 = require("../services/game.service");
var websocket_service_1 = require("../services/websocket.service");
var LobbyComponent = (function () {
    function LobbyComponent(authService, gameService, router, webSocketService) {
        this.authService = authService;
        this.gameService = gameService;
        this.router = router;
        this.webSocketService = webSocketService;
        this.myGames = [];
        this.otherGames = [];
        this.already_join = false;
        this.info = "";
    }
    ;
    LobbyComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.findMyGames();
        this.findOtherGames();
        this.webSocketService.getCreateRoom().subscribe(function (m) {
            console.log("ROOOM CREATEDEE");
            _this.findOtherGames();
            _this.findMyGames();
        });
        this.webSocketService.getJoinOnRoom().subscribe(function (m) {
            console.log("Join Player: " + m);
            _this.findMyGames();
            _this.findOtherGames();
        });
        this.webSocketService.getGameStart().subscribe(function (m) {
            console.log("Jogo vai começar: " + m);
            console.log("SADSAD");
            _this.router.navigateByUrl('/table-game/' + m);
        });
        this.webSocketService.getRoomDeleted().subscribe(function (m) {
            console.log("Apaguei jogo");
            _this.findOtherGames();
            _this.findMyGames();
        });
    };
    LobbyComponent.prototype.findMyGames = function () {
        var _this = this;
        //console.log(JSON.parse(localStorage.getItem('user'));
        this.gameService.findMyGames(JSON.parse(localStorage.getItem('user'))).subscribe(function (games) {
            _this.myGames = games;
        });
        //console.log(this.myGames);
    };
    LobbyComponent.prototype.findOtherGames = function () {
        var _this = this;
        this.gameService.findOtherGames(JSON.parse(localStorage.getItem('user'))).subscribe(function (games) {
            _this.otherGames = games;
        });
    };
    LobbyComponent.prototype.createGame = function () {
        var _this = this;
        this.gameService.createGame(JSON.parse(localStorage.getItem('user'))).subscribe(function (resource) {
            if (resource !== 'No game data') {
                _this.info = "Game created";
                _this.webSocketService.createRoom({ room: 'room' + resource._id,
                    userId: _this.authService.getCurrentUser()._id, username: _this.authService.getCurrentUser().username });
                _this.findMyGames();
            }
            else {
                _this.info = "Error creating game";
            }
        });
    };
    LobbyComponent.prototype.deleteGame = function (i) {
        this.gameService.deleteGame(this.myGames[i], this.authService.getCurrentUser()).subscribe(function (resource) {
            return console.log(resource + 'hhh');
        });
        this.findMyGames();
        this.router.navigateByUrl(this.router.url);
    };
    LobbyComponent.prototype.joinGame = function (i) {
        var _this = this;
        //verify length and status
        if (this.otherGames[i].nplayers == 4 || this.otherGames[i].status != "on lobby") {
            console.log('game is full');
            return;
        }
        this.already_join = false;
        this.otherGames[i].players.forEach(function (player) {
            if (player.player == _this.authService.getCurrentUser()._id) {
                console.log('already join');
                _this.already_join = true;
            }
        });
        if (!this.already_join) {
            this.webSocketService.joinRoom({ userId: this.authService.getCurrentUser()._id, username: this.authService.getCurrentUser().username, room: 'room' + this.otherGames[i]._id });
            this.otherGames[i].players.push({ player: this.authService.getCurrentUser()._id, points: 0 });
            this.otherGames[i].nplayers = this.otherGames[i].nplayers + 1;
            this.gameService.updateGame(this.otherGames[i], this.authService.getCurrentUser()).subscribe(function (response) {
                /*console.log(response)*/
                if (response.nplayers == 2) {
                    console.log('game will start');
                    response.status = 'on going';
                    _this.gameService.updateGame(response, _this.authService.getCurrentUser()).subscribe(function (res) { return console.log('1' + res); });
                    _this.webSocketService.sendStartGame({ room: 'room' + _this.otherGames[i]._id,
                        userId: _this.authService.getCurrentUser()._id, username: _this.authService.getCurrentUser()._username });
                    console.log("pedido efectuado");
                }
            });
        }
    };
    return LobbyComponent;
}());
LobbyComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'lobby',
        templateUrl: 'lobby.component.html'
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService, game_service_1.GameService, router_1.Router,
        websocket_service_1.WebSocketService])
], LobbyComponent);
exports.LobbyComponent = LobbyComponent;
//# sourceMappingURL=lobby.component.js.map