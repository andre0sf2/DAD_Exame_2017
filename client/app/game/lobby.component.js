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
var auth_service_1 = require('../services/auth.service');
var game_service_1 = require('../services/game.service');
var LobbyComponent = (function () {
    function LobbyComponent(authService, gameService, router) {
        this.authService = authService;
        this.gameService = gameService;
        this.router = router;
        this.myGames = [];
        this.otherGames = [];
        this.already_join = false;
        this.info = "";
    }
    ;
    LobbyComponent.prototype.ngOnInit = function () {
        this.findMyGames();
        this.findOtherGames();
        /*this.websocketService.getNewRoom().subscribe((m: any) => {
            this.findOtherGames();
            this.findMyGames();
        });

        this.websocketService.getJoinOnRoom().subscribe((m: any) => {
            console.log("Join Player: " + m);
            this.findMyGames();
            this.findOtherGames();
        });

        this.websocketService.getGameStart().subscribe((m: any) => {
            console.log("Jogo vai começar: " + m);
            this.router.navigateByUrl('/table-game/' + m);
        });

        this.websocketService.getRoomDeleted().subscribe((m: any) => {
            console.log("Apaguei jogo");
            this.findOtherGames();
            this.findMyGames();
        });*/
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
                //               this.websocketService.newRoom({room:'Room' + /*roomName+*/ resource._id, userId: })
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
            this.otherGames[i].players.push({ player: this.authService.getCurrentUser()._id, score: 0 });
            this.otherGames[i].nplayers = this.otherGames[i].nplayers + 1;
            this.gameService.updateGame(this.otherGames[i], this.authService.getCurrentUser()).subscribe(function (response) {
                /*console.log(response)*/
                if (response.nplayers == 4) {
                    console.log('game will start');
                    response.status = 'on play';
                    _this.gameService.updateGame(response, _this.authService.getCurrentUser()).subscribe(function (res) { return console.log('1' + res); });
                }
            });
        }
    };
    LobbyComponent.prototype.startGame = function (i) {
        var room = 'room' + this.myGames[i]._id;
        //notifyAll
        this.myGames[i].status = 'playing';
        this.gameService.updateGame(this.myGames[i], this.authService.getCurrentUser()).subscribe(function (r) { return console.log(r); });
        this.router.navigateByUrl('/table-game/' + Date.now());
        //this.websocketService.notifyAllPlayerGameStarted({ message: 'Game Start!', room: room });
    };
    LobbyComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'lobby',
            templateUrl: 'lobby.component.html'
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, game_service_1.GameService, router_1.Router])
    ], LobbyComponent);
    return LobbyComponent;
}());
exports.LobbyComponent = LobbyComponent;
//# sourceMappingURL=lobby.component.js.map