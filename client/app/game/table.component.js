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
var websocket_service_1 = require("../services/websocket.service");
var card_1 = require("../model/card");
var mesa_1 = require("../model/mesa");
var TableComponent = (function () {
    function TableComponent(router, auth, websocketService, activeRoute) {
        this.router = router;
        this.auth = auth;
        this.websocketService = websocketService;
        this.activeRoute = activeRoute;
        this.error = '';
        this.cards = [];
        this.baralhoJogadores = [];
        this.jogadores = [];
        this.jogPics = [];
        this.chatChannel = [];
        this.isMyTurn = false;
        this.currentRound = 0;
        this.suitImg = "";
        this.suitName = "";
        this.user = this.auth.getCurrentUser().username;
        this.cartasJogadas = [];
        this.getSuit();
    }
    TableComponent.prototype.gotoLobby = function () {
        this.router.navigateByUrl('');
    };
    TableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.cards = [];
        this.baralhoJogadores = [];
        this.jogadores = [];
        this.activeRoute.params.subscribe(function (params) {
            _this.room = params['room'];
        });
        this.getGamePlayers();
        this.getMyCards();
        this.websocketService.getCard(this.auth.getCurrentUser().username).subscribe(function (m) {
            console.log(m);
        });
        this.getTurn();
        this.getMoves();
        this.getRoundWinners();
        this.getSuit();
        this.getFinal();
        this.checkCheating();
        /*this.websocketService.getChatMessagesOnRoom().subscribe((m: any) => this.chatChannel.push(<string>m));



        console.log(this.room);
/*        this.route.params
            .switchMap((params: Params) => this.gameService.getGame(params['room']))
            .subscribe((game: Game) => this.game = game);*/
        this.mesa = new mesa_1.Mesa();
        this.cards = this.mesa.cards;
        this.baralharCartas(this.cards);
    };
    TableComponent.prototype.getMyCards = function () {
        var _this = this;
        this.websocketService.getMyCards().subscribe(function (m) {
            //console.log("MINHAS CARTAS: v2" + m.card);
            var c = new card_1.Card(m.card._tipoCard, m.card._simbolo, m.card._ponto, m.card._img);
            _this.baralhoJogadores.push(c);
            _this.baralhoJogadores.sort();
        });
    };
    TableComponent.prototype.getTurn = function () {
        var _this = this;
        this.websocketService.getTurn().subscribe(function (m) {
            //console.log(m);
            if (m.username == _this.auth.getCurrentUser().username) {
                console.log("ITS YOUR TURN");
                _this.isMyTurn = true;
                _this.currentRound = m.round;
            }
            _this.jogadores.forEach(function (jogador) {
                if (m.username != jogador) {
                    var sty_1 = document.getElementById(jogador + "sep");
                    sty_1.style.color = "black";
                }
            });
            var sty = document.getElementById(m.username + "sep");
            sty.style.color = "yellow";
        });
    };
    TableComponent.prototype.getFinal = function () {
        this.websocketService.getFinal().subscribe(function (m) {
            console.log("GAME OVER - WINNERS");
            console.log(m);
            alert("GAME OVER - WINNERS: " + m.winner1 + "and\t " + m.winner2);
        });
    };
    TableComponent.prototype.getRoundWinners = function () {
        var _this = this;
        this.websocketService.getRoundWinners().subscribe(function (m) {
            console.log("WINNER OF ROUND");
            console.log(m);
            _this.cleanMesa();
        });
    };
    TableComponent.prototype.getGamePlayers = function () {
        var _this = this;
        this.websocketService.getGamePlayers(this.room).subscribe(function (m) {
            _this.jogadores.push(m.username);
            _this.jogPics.push(m.img);
            //console.log(m);
        });
    };
    TableComponent.prototype.getSuit = function () {
        var _this = this;
        console.log("get trunfo");
        this.websocketService.getSuit({ room: this.room }).subscribe(function (m) {
            //console.log("Trunfo é: " + m._tipoCard);
            _this.suitImg = m._img;
            switch (m._tipoCard) {
                case "o":
                    _this.suitName = "Ouros";
                    break;
                case "p":
                    _this.suitName = "Paus";
                    break;
                case "e":
                    _this.suitName = "Espadas";
                    break;
                case "c":
                    _this.suitName = "Copas";
                    break;
            }
        });
    };
    TableComponent.prototype.getMoves = function () {
        this.websocketService.getMoves().subscribe(function (m) {
            //console.log(m);
            var img = document.getElementById(m.username);
            img.setAttribute("src", m.card._img);
        });
    };
    TableComponent.prototype.cleanMesa = function () {
        this.jogadores.forEach(function (jogador) {
            var img = document.getElementById(jogador);
            img.setAttribute("src", "../../img/cards/semFace.png");
        });
    };
    TableComponent.prototype.getCardBaralho = function (card) {
        if (this.isMyTurn) {
            for (var i = 0; i < this.cards.length; i++) {
                if (this.cards[i].tipoCard == card.tipoCard && this.cards[i].simbolo == card.simbolo) {
                    //console.log(this.cards[i].toString());
                    this.websocketService.sendCard({ room: this.room, round: this.currentRound, username: this.auth.getCurrentUser().username, card: this.cards[i] });
                    this.removeCard(this.cards[i]);
                }
            }
            this.isMyTurn = false;
        }
        else {
            console.log("WARNING - wait for your turn");
        }
    };
    TableComponent.prototype.checkCheating = function () {
        var _this = this;
        this.websocketService.getRenunciaFeedBack().subscribe(function (m) {
            console.log(m);
            _this.cleanMesa();
        });
    };
    TableComponent.prototype.renuncia = function (playerVerificar, playerDenuncia) {
        if (this.user != playerVerificar) {
            //console.log(playerVerificar, playerDenuncia);
            this.websocketService.sendRenuncia({
                verificar: playerVerificar, denuncia: playerDenuncia, room: this.room
            });
        }
    };
    TableComponent.prototype.removeCard = function (card) {
        for (var i = 0; i < this.baralhoJogadores.length; i++) {
            if (this.baralhoJogadores[i].tipoCard == card.tipoCard && this.baralhoJogadores[i].simbolo == card.simbolo) {
                this.baralhoJogadores.splice(i, 1);
            }
        }
    };
    TableComponent.prototype.baralharCartas = function (cards) {
        var j, k;
        for (var i = cards.length; i; i--) {
            j = Math.floor(Math.random() * i);
            k = cards[i - 1];
            cards[i - 1] = cards[j];
            cards[j] = k;
        }
    };
    return TableComponent;
}());
TableComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'game',
        templateUrl: 'table.component.html',
        styleUrls: ['table.component.css']
    }),
    __metadata("design:paramtypes", [router_1.Router, auth_service_1.AuthService, websocket_service_1.WebSocketService,
        router_1.ActivatedRoute])
], TableComponent);
exports.TableComponent = TableComponent;
//# sourceMappingURL=table.component.js.map