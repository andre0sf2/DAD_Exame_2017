"use strict";
var io = require('socket.io');
var WebSocketServer = (function () {
    function WebSocketServer() {
        var _this = this;
        this.games = [];
        this.init = function (server) {
            _this.io = io.listen(server);
            _this.io.sockets.on('connection', function (client) {
                client.player = new Player();
                client.emit('players', Date.now() + ': Welcome to Sueca Online');
                client.broadcast.emit('players', Date.now() + ': A new player has arrived');
                client.on('lobby-chat', function (data) { return _this.io.emit('lobby-chat', data); });
                client.on('room-chat', function (data) {
                    _this.io.to(client.player.gameRoom).emit('room-chat', data);
                });
                client.on('room', function (data) {
                    console.log("One room was created" + data.room);
                    client.join(data.room); // o utilizador junta-se ao room que criou
                    client.player.username = data.username;
                    client.player.id = data.userId;
                    client.player.gameRoom = data.room;
                    client.player.socketId = client.id;
                    _this.games[data.room] = new Mesa();
                    _this.games[data.room].gameRoom = data.room;
                    _this.games[data.room].gamers.push(data.username);
                    _this.games[data.room].sockets.push(client.id);
                });
                client.on('join', function (data) {
                    console.log("One player joined the room " + data.room);
                    client.player.gameRoom = data.room;
                    client.player.socketId = data.id;
                    client.player.username = data.username;
                    client.join(client.player.gameRoom);
                    _this.games[data.room].gamers.push(data.username);
                    _this.games[data.room].sockets.push(client.id);
                });
                client.on('start-game', function (data) {
                    console.log("Game will start" + data.room + " sdad " + client.player.gameRoom);
                    _this.io.to(client.player.gameRoom).emit('game-start', client.player.gameRoom);
                    console.log('GAME WILL START ->' + client.player.gameRoom);
                    _this.io.emit(client.player.gameRoom).emit('game-start', client.player.gameRoom);
                    _this.games[data.room].gamers.forEach(function (player) {
                        console.log(player);
                    });
                    console.log(_this.games[data.room].getSuit());
                    _this.io.to(client.player.gameRoom).emit('suit', _this.games[data.room].getSuit());
                    ///this.games[data.room].gamers.forEach((player:any) => {
                    var index = 0;
                    _this.games[data.room].sockets.forEach(function (client) {
                        _this.io.to(client).emit('my-cards', { room: data.room, card: _this.games[data.room].cards[0 + index] });
                        _this.io.to(client).emit('my-cards', { room: data.room, card: _this.games[data.room].cards[1 + index] });
                        _this.io.to(client).emit('my-cards', { room: data.room, card: _this.games[data.room].cards[2 + index] });
                        _this.io.to(client).emit('my-cards', { room: data.room, card: _this.games[data.room].cards[3 + index] });
                        _this.io.to(client).emit('my-cards', { room: data.room, card: _this.games[data.room].cards[4 + index] });
                        _this.io.to(client).emit('my-cards', { room: data.room, card: _this.games[data.room].cards[5 + index] });
                        _this.io.to(client).emit('my-cards', { room: data.room, card: _this.games[data.room].cards[6 + index] });
                        _this.io.to(client).emit('my-cards', { room: data.room, card: _this.games[data.room].cards[7 + index] });
                        _this.io.to(client).emit('my-cards', { room: data.room, card: _this.games[data.room].cards[8 + index] });
                        _this.io.to(client).emit('my-cards', { room: data.room, card: _this.games[data.room].cards[9 + index] });
                        index = +10;
                    });
                    _this.games[data.room].gamers.forEach(function (player) {
                        console.log("PLayers: " + player);
                        _this.io.to(client.player.gameRoom).emit('players-on-game', player);
                    });
                });
                client.on('players-on-game', function (data) {
                    _this.games[data.room].gamers.forEach(function (player) {
                        _this.io.to(client.player.gameRoom).emit('players-on-game', player);
                    });
                });
                client.on('card', function (data) {
                    console.log(data.card, "User " + data.username);
                    _this.io.to(client.player.gameRoom).emit('card', { username: data.username, card: data.card });
                });
            });
        };
        this.notifyAll = function (channel, message) {
            _this.io.sockets.emit(channel, message);
        };
    }
    return WebSocketServer;
}());
exports.WebSocketServer = WebSocketServer;
;
var Player = (function () {
    function Player() {
    }
    return Player;
}());
exports.Player = Player;
var Mesa = (function () {
    function Mesa() {
        var _this = this;
        this.gamers = [];
        this.sockets = [];
        this.gameRoom = '';
        this.gamers = [];
        this.sockets = [];
        this.cards = [];
        Mesa.todosOsNaipes().forEach(function (naipe) {
            Mesa.todosOsSimbolos().forEach(function (simbolo) {
                var c = null;
                var img = '../../cards-1/' + naipe + simbolo + ".png";
                switch (simbolo) {
                    case 1:
                        c = new Card(naipe, simbolo, 11, img);
                        break;
                    case 7:
                        c = new Card(naipe, simbolo, 10, img);
                        break;
                    case 13:
                        c = new Card(naipe, simbolo, 4, img);
                        break;
                    case 11:
                        c = new Card(naipe, simbolo, 3, img);
                        break;
                    case 12:
                        c = new Card(naipe, simbolo, 2, img);
                        break;
                    default: c = new Card(naipe, simbolo, 0, img);
                }
                _this.cards.push(c);
            });
        });
        this.baralharCartas();
    }
    Mesa.prototype.getSuit = function () {
        return this.cards[this.cards.length - 1];
    };
    Mesa.prototype.baralharCartas = function () {
        var j, k;
        for (var i = this.cards.length; i; i--) {
            j = Math.floor(Math.random() * i);
            k = this.cards[i - 1];
            this.cards[i - 1] = this.cards[j];
            this.cards[j] = k;
        }
        console.log(this.cards);
    };
    Mesa.prototype.getCard = function (naipe, simbolo) {
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].tipoCard == naipe && this.cards[i].simbolo == simbolo) {
                return this.cards[i];
            }
        }
        return;
    };
    Mesa.todosOsNaipes = function () {
        return ['o', 'e', 'p', 'c'];
    };
    Mesa.todosOsSimbolos = function () {
        return [1, 2, 3, 4, 5, 6, 7, 11, 12, 13];
    };
    return Mesa;
}());
exports.Mesa = Mesa;
var Card = (function () {
    function Card(tipo, id, pontos, img) {
        this._tipoCard = tipo;
        this._simbolo = id;
        this._isAval = true;
        this._ponto = pontos;
        this._img = img;
    }
    Card.prototype.toString = function () {
        return "Naipe: " + this._tipoCard + " Simbolo: " + this._simbolo + " Pontos: " + this._ponto + "\n";
    };
    Object.defineProperty(Card.prototype, "tipoCard", {
        get: function () {
            return this._tipoCard;
        },
        set: function (value) {
            this._tipoCard = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "simbolo", {
        get: function () {
            return this._simbolo;
        },
        set: function (value) {
            this._simbolo = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "isAval", {
        get: function () {
            return this._isAval;
        },
        set: function (value) {
            this._isAval = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "ponto", {
        get: function () {
            return this._ponto;
        },
        set: function (value) {
            this._ponto = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "img", {
        get: function () {
            return this._img;
        },
        set: function (value) {
            this._img = value;
        },
        enumerable: true,
        configurable: true
    });
    return Card;
}());
exports.Card = Card;
//# sourceMappingURL=app.websockets.js.map