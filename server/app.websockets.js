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
                client.on('lobby-chat', function (data) { return _this.io.emit('lobby-chat', {
                    image: data.image, username: data.username, date: data.date
                }); });
                client.on('room-chat', function (data) {
                    _this.io.to(client.player.gameRoom).emit('room-chat', {
                        image: data.image, username: data.username, date: data.date
                    });
                });
                client.on('room', function (data) {
                    console.log("One room was created" + data.room);
                    client.join(data.room); // o utilizador junta-se ao room que criou
                    client.player.username = data.username;
                    client.player.img = data.img;
                    client.player.id = data.userId;
                    client.player.gameRoom = data.room;
                    client.player.socketId = client.id;
                    _this.games[data.room] = new Mesa();
                    _this.games[data.room].gameRoom = data.room;
                    _this.games[data.room].gamers.push(data.username);
                    _this.games[data.room].playersPics.push(data.img);
                    _this.games[data.room].sockets.push(client.id);
                });
                client.on('join', function (data) {
                    console.log("One player joined the room " + data.room);
                    client.player.gameRoom = data.room;
                    client.player.socketId = data.id;
                    client.player.username = data.username;
                    client.player.img = data.img;
                    client.join(client.player.gameRoom);
                    _this.games[data.room].gamers.push(data.username);
                    _this.games[data.room].playersPics.push(data.img);
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
                        console.log(index);
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
                        index += 10;
                    });
                    _this.games[data.room].gamers.forEach(function (m, i) {
                        _this.games[data.room].picsNames.push({ username: m, img: _this.games[data.room].playersPics[i] });
                    });
                    _this.games[data.room].picsNames.forEach(function (player) {
                        _this.io.to(client.player.gameRoom).emit('players-on-game', {
                            username: player.username, img: player.img
                        });
                    });
                    _this.games[data.room].startRound();
                    console.log(_this.games[data.room].rounds[0].firstPlayer);
                    //send first player from match
                    _this.io.to(client.player.gameRoom).emit('turn', { username: _this.games[data.room].rounds[0].firstPlayer, round: _this.games[data.room].round });
                });
                client.on('players-on-game', function (data) {
                    _this.games[data.room].gamers.forEach(function (player) {
                        _this.io.to(client.player.gameRoom).emit('players-on-game', player);
                    });
                });
                //quando recebe uma carta
                client.on('card', function (data) {
                    //console.log(data.card, "User " + data.username);
                    console.log(data.round, data.username, data.card);
                    _this.games[data.room].addMove(data.round, data.username, data.card);
                    _this.io.to(client.player.gameRoom).emit('move', data);
                    //console.log("1"+this.games[data.room].rounds[data.round].player1_option);
                    //console.log("2"+this.games[data.room].rounds[data.round].player2_option);
                    //console.log("3"+this.games[data.room].rounds[data.round].player3_option);
                    //console.log("4"+this.games[data.room].rounds[data.round].player4_option);
                    if (_this.games[data.room].rounds[data.round].player1_option != null &&
                        _this.games[data.room].rounds[data.round].player2_option != null &&
                        _this.games[data.room].rounds[data.round].player3_option != null &&
                        _this.games[data.room].rounds[data.round].player4_option != null) {
                        _this.games[data.room].calculateRound(data.round);
                        //TODO: emit winner round and points
                        console.log("WINNER" + _this.games[data.room].rounds[data.round].winner);
                        console.log("POINTS: " + _this.games[data.room].rounds[data.round].points);
                        _this.io.to(client.player.gameRoom).emit('round', { round: data.round, points: _this.games[data.room].rounds[data.round].points, winner: _this.games[data.room].rounds[data.round].winner });
                        console.log("STARTING ROUND " + _this.games[data.room].round);
                        _this.games[data.room].startRound();
                        _this.io.to(client.player.gameRoom).emit('turn', { username: _this.games[data.room].rounds[_this.games[data.room].round].firstPlayer, round: _this.games[data.room].round });
                    }
                    else {
                        var nextplayer = "";
                        nextplayer = _this.games[data.room].nextPlayer(data.round, data.username);
                        console.log("NEXT PLAYER => " + nextplayer);
                        console.log("ROUND " + _this.games[data.room].round);
                        _this.io.to(client.player.gameRoom).emit('turn', { username: nextplayer, round: _this.games[data.room].round });
                    }
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
var Round = (function () {
    function Round() {
    }
    return Round;
}());
exports.Round = Round;
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
        this.playersPics = [];
        this.picsNames = [];
        this.sockets = [];
        this.round = 0;
        this.rounds = [];
        this.gameRoom = '';
        this.gamers = [];
        this.sockets = [];
        this.cards = [];
        Mesa.todosOsNaipes().forEach(function (naipe) {
            Mesa.todosOsSimbolos().forEach(function (simbolo) {
                var c = null;
                var img = '../img/cards/' + naipe + simbolo + ".png";
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
    Mesa.prototype.startRound = function () {
        this.rounds[this.round] = new Round();
        if (this.round == 0) {
            this.rounds[this.round].firstPlayer = this.gamers[0];
            this.rounds[this.round].secondPlayer = this.gamers[1];
            this.rounds[this.round].thirdPlayer = this.gamers[2];
            this.rounds[this.round].fourPlayer = this.gamers[3];
        }
        else {
            console.log("STARTING ROUND: " + this.round);
            this.rounds[this.round].firstPlayer = this.rounds[this.round - 1].winner;
            if (this.rounds[this.round].firstPlayer == this.gamers[0]) {
                this.rounds[this.round].secondPlayer = this.gamers[1];
                this.rounds[this.round].thirdPlayer = this.gamers[2];
                this.rounds[this.round].fourPlayer = this.gamers[3];
            }
            else if (this.rounds[this.round].firstPlayer == this.gamers[1]) {
                this.rounds[this.round].secondPlayer = this.gamers[2];
                this.rounds[this.round].thirdPlayer = this.gamers[3];
                this.rounds[this.round].fourPlayer = this.gamers[0];
            }
            else if (this.rounds[this.round].firstPlayer == this.gamers[2]) {
                this.rounds[this.round].secondPlayer = this.gamers[3];
                this.rounds[this.round].thirdPlayer = this.gamers[0];
                this.rounds[this.round].fourPlayer = this.gamers[1];
            }
            else if (this.rounds[this.round].firstPlayer == this.gamers[3]) {
                this.rounds[this.round].secondPlayer = this.gamers[0];
                this.rounds[this.round].thirdPlayer = this.gamers[1];
                this.rounds[this.round].fourPlayer = this.gamers[2];
            }
        }
    };
    Mesa.prototype.addMove = function (round, player, card) {
        if (this.gamers[0] == player) {
            this.rounds[round].player1_option = card;
        }
        else if (this.gamers[1] == player) {
            this.rounds[round].player2_option = card;
        }
        else if (this.gamers[2] == player) {
            this.rounds[round].player3_option = card;
        }
        else if (this.gamers[3] == player) {
            this.rounds[round].player4_option = card;
        }
        else {
            console.log("error.not find player");
        }
        /*        if (this.rounds[round].player1_option != null && this.rounds[round].player2_option != null && this.rounds[round].player3_option != null && this.rounds[round].player4_option != null) {
                    this.calculateRound(this.round);
                }*/
    };
    Mesa.prototype.calculateRound = function (round) {
        //getCartasUsadas
        console.log("\n\n\n\nAVALIACAO DA RONDA : " + round);
        var card1 = this.rounds[round].player1_option;
        var card2 = this.rounds[round].player2_option;
        var card3 = this.rounds[round].player3_option;
        var card4 = this.rounds[round].player4_option;
        console.log(card1);
        //GET TRUNFO
        var trunfo = this.cards[39].tipoCard;
        console.log("TRUNFO : " + trunfo);
        //GET NAIPE DA JOGADA
        var tipo;
        if (this.rounds[round].firstPlayer == this.gamers[0]) {
            tipo = card1._tipoCard;
        }
        else if (this.rounds[round].firstPlayer == this.gamers[1]) {
            tipo = card2._tipoCard;
        }
        else if (this.rounds[round].firstPlayer == this.gamers[2]) {
            tipo = card3._tipoCard;
        }
        else if (this.rounds[round].firstPlayer == this.gamers[3]) {
            tipo = card4._tipoCard;
        }
        console.log("NAIPE DA JOGADA: " + tipo);
        //COUNT TRUNFOS
        var countTrunfos = 0;
        var card1trunfo = false;
        var card2trunfo = false;
        var card3trunfo = false;
        var card4trunfo = false;
        if (card1._tipoCard == trunfo) {
            countTrunfos++;
            card1trunfo = true;
        }
        if (card2._tipoCard == trunfo) {
            countTrunfos++;
            card2trunfo = true;
        }
        if (card3._tipoCard == trunfo) {
            countTrunfos++;
            card3trunfo = true;
        }
        if (card4._tipoCard == trunfo) {
            countTrunfos++;
            card4trunfo = true;
        }
        //se apenas foi usado um trunfo na ronda ele ganha
        if (countTrunfos == 1) {
            if (card1._tipoCard == trunfo) {
                this.rounds[round].winner = this.gamers[0];
            }
            else if (card2._tipoCard == trunfo) {
                this.rounds[round].winner = this.gamers[1];
            }
            else if (card3._tipoCard == trunfo) {
                this.rounds[round].winner = this.gamers[2];
            }
            else if (card4._tipoCard == trunfo) {
                this.rounds[round].winner = this.gamers[3];
            }
            console.log("APENAS UM TRUNFO. WINNER É " + this.rounds[round].winner);
        }
        //se foi usado mais que um trunfo ganha o que tiver o trunfo mais alto
        if (countTrunfos > 1) {
            var higherCardPoints = 0;
            var higherCardSimb = 0;
            var winner = void 0;
            if (card1trunfo) {
                if (card1._ponto != 0 && card1._ponto > higherCardPoints) {
                    higherCardPoints = card1._ponto;
                    winner = this.gamers[0];
                }
                if (card1._ponto == 0 && card1._simbolo > higherCardSimb) {
                    higherCardSimb = card1._simbolo;
                    winner = this.gamers[0];
                }
            }
            if (card2trunfo) {
                if (card2._ponto != 0 && card2._ponto > higherCardPoints) {
                    higherCardPoints = card2._ponto;
                    winner = this.gamers[1];
                }
                if (card2._ponto == 0 && card2._simbolo > higherCardSimb) {
                    higherCardSimb = card2._simbolo;
                    winner = this.gamers[1];
                }
            }
            if (card3trunfo) {
                if (card3._ponto > higherCardPoints && card3._ponto != 0) {
                    higherCardPoints = card3._ponto;
                    winner = this.gamers[2];
                }
                if (card3._ponto == 0 && card3._simbolo > higherCardSimb) {
                    higherCardSimb = card3._simbolo;
                    winner = this.gamers[2];
                }
            }
            if (card4trunfo) {
                if (card4._ponto > higherCardPoints && card4._ponto != 0) {
                    higherCardPoints = card4._ponto;
                    winner = this.gamers[3];
                }
                if (card4._ponto == 0 && card4._simbolo > higherCardSimb) {
                    higherCardSimb = card4._simbolo;
                    winner = this.gamers[3];
                }
            }
            this.rounds[round].winner = winner;
            console.log("VARIOS TRUNFOS . VENCEDOR É : " + this.rounds[round].winner);
        }
        //se nao houver trunfos, ganha quem tiver ganho posto a carta mais alta do naipe que o 1 jogador colocou
        if (countTrunfos == 0) {
            console.log("NAO HOUVE TRUNFOS JOGADOS");
            var higherCardPoints = 0;
            var higherCardSimb = 0;
            var winner = void 0;
            if (card1._tipoCard == tipo && card1._ponto > higherCardPoints && card1._ponto != 0) {
                higherCardPoints = card1._ponto;
                winner = this.gamers[0];
            }
            if (card1._tipoCard == tipo && card1._ponto == 0 && card1._simbolo > higherCardSimb) {
                higherCardSimb = card1._simbolo;
                winner = this.gamers[0];
            }
            if (card2._tipoCard == tipo && card2._ponto > higherCardPoints && card2._ponto != 0) {
                higherCardPoints = card2._ponto;
                winner = this.gamers[1];
            }
            if (card2._tipoCard == tipo && card2._ponto == 0 && card2._simbolo > higherCardSimb) {
                higherCardSimb = card2._simbolo;
                winner = this.gamers[1];
            }
            if (card3._tipoCard == tipo && card3._ponto > higherCardPoints && card3._ponto != 0) {
                higherCardPoints = card3._ponto;
                winner = this.gamers[2];
            }
            if (card3._tipoCard == tipo && card3._ponto == 0 && card3._simbolo > higherCardSimb) {
                higherCardSimb = card3._simbolo;
                winner = this.gamers[2];
            }
            if (card4._tipoCard == tipo && card4._ponto > higherCardPoints && card4._ponto != 0) {
                higherCardPoints = card4._ponto;
                winner = this.gamers[3];
            }
            if (card4._tipoCard == tipo && card4._ponto == 0 && card4._simbolo > higherCardSimb) {
                higherCardSimb = card4._simbolo;
                winner = this.gamers[3];
            }
            this.rounds[round].winner = winner;
        }
        //ADICIONA OS PONTOS E COMEÇA NOVA RONDA
        this.rounds[round].points = card1._ponto + card2._ponto + card3._ponto + card4._ponto;
        console.log("NUMERO DE PONTOS DA JOGADA " + this.rounds[round].points);
        console.log("FINAL VENCEDOR DA RONDA: " + this.rounds[round].winner);
        this.round++;
        //this.startRound();
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
    Mesa.prototype.nextPlayer = function (round, lastPlayer) {
        if (this.rounds[round].firstPlayer == lastPlayer) {
            return this.rounds[round].secondPlayer;
        }
        else if (this.rounds[round].secondPlayer == lastPlayer) {
            return this.rounds[round].thirdPlayer;
        }
        else if (this.rounds[round].thirdPlayer == lastPlayer) {
            return this.rounds[round].fourPlayer;
        }
        return "";
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