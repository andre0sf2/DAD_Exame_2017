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
var Observable_1 = require("rxjs/Observable");
var io = require("socket.io-client");
var WebSocketService = (function () {
    function WebSocketService() {
        if (!this.socket) {
            this.socket = io("http://localhost:7777");
        }
    }
    WebSocketService.prototype.getTurn = function () {
        return this.listenOnChannel('turn');
    };
    WebSocketService.prototype.getRoundWinners = function () {
        return this.listenOnChannel('round');
    };
    WebSocketService.prototype.sendRenuncia = function (message) {
        this.socket.emit('renuncia', message);
    };
    WebSocketService.prototype.getRenunciaFeedBack = function () {
        return this.listenOnChannel('renuncia-feedback');
    };
    WebSocketService.prototype.getFinal = function () {
        return this.listenOnChannel('final');
    };
    WebSocketService.prototype.getMoves = function () {
        return this.listenOnChannel('move');
    };
    WebSocketService.prototype.getMyCards = function () {
        return this.listenOnChannel('my-cards');
    };
    WebSocketService.prototype.getGamePlayers = function (roomID) {
        //this.socket.emit('players-on-game', {room: roomID});
        return this.listenOnChannel('players-on-game');
    };
    WebSocketService.prototype.getSuit = function (room) {
        //       this.socket.emit('suit', room);
        return this.listenOnChannel('suit');
    };
    WebSocketService.prototype.sendStartGame = function (message) {
        this.socket.emit('start-game', message);
        console.log("sendStartGame");
    };
    WebSocketService.prototype.sendChatMessage = function (message) {
        this.socket.emit('lobby-chat', message);
    };
    WebSocketService.prototype.getPlayersMessages = function () {
        return this.listenOnChannel('players');
    };
    WebSocketService.prototype.getChatMessages = function () {
        return this.listenOnChannel('lobby-chat');
    };
    WebSocketService.prototype.getNotes = function () {
        // console.log("entrei auqi ");
        return this.listenOnChannel('notes');
    };
    WebSocketService.prototype.sendChatMessageToRoom = function (room, message) {
        this.socket.emit('room-chat', message);
    };
    WebSocketService.prototype.getChatMessagesFromRoom = function (room) {
        return this.listenOnChannel('room-chat');
    };
    WebSocketService.prototype.sendNote = function (message) {
        this.socket.emit('notes', message);
    };
    WebSocketService.prototype.getDerrotado = function () {
        return this.listenOnChannel('derrotado');
    };
    WebSocketService.prototype.sendClickElementMessage = function (index) {
        this.socket.emit('clickElement', index);
    };
    WebSocketService.prototype.getBoardMessages = function () {
        return this.listenOnChannel('board');
    };
    WebSocketService.prototype.createRoom = function (message) {
        this.socket.emit('room', message);
        console.log("room created");
    };
    WebSocketService.prototype.getCreateRoom = function () {
        return this.listenOnChannel('room');
    };
    WebSocketService.prototype.roomDeleted = function (message) {
        this.socket.emit('roomDeleted', message);
    };
    WebSocketService.prototype.getRoomDeleted = function () {
        return this.listenOnChannel('roomDeleted');
    };
    WebSocketService.prototype.joinRoom = function (message) {
        this.socket.emit('join', message);
    };
    WebSocketService.prototype.getJoinOnRoom = function () {
        return this.listenOnChannel('join');
    };
    WebSocketService.prototype.notifyAllPlayerGameStarted = function (message) {
        this.socket.emit('game-start', message);
    };
    WebSocketService.prototype.getGameStart = function () {
        return this.listenOnChannel('game-start');
    };
    WebSocketService.prototype.sendCard = function (message) {
        //console.log(message);
        this.socket.emit('card', message);
    };
    WebSocketService.prototype.getCard = function (message) {
        return this.listenOnChannel('card');
    };
    WebSocketService.prototype.listenOnChannel = function (channel) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.on(channel, function (data) {
                observer.next(data);
            });
            return function () { return _this.socket.disconnect(); };
        });
    };
    return WebSocketService;
}());
WebSocketService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], WebSocketService);
exports.WebSocketService = WebSocketService;
//# sourceMappingURL=websocket.service.js.map