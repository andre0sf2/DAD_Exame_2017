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
var mesa_1 = require("./mesa");
var TableComponent = (function () {
    function TableComponent(router, auth, websocketService, activeRoute) {
        this.router = router;
        this.auth = auth;
        this.websocketService = websocketService;
        this.activeRoute = activeRoute;
        this.error = '';
        this.cards = [];
        this.baralhoJogadores = [];
        this.adversarios = [];
        this.temAdversario = false;
        this.chatChannel = [];
        this.allReady = false;
        this.isMyTurn = false;
        this.suit = "";
        this.user = this.auth.getCurrentUser().username;
    }
    TableComponent.prototype.gotoLobby = function () {
        this.router.navigateByUrl('');
    };
    TableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.cards = [];
        this.baralhoJogadores = [];
        this.activeRoute.params.subscribe(function (params) {
            _this.room = params['room'];
        });
        this.websocketService.getGamePlayers(this.room).subscribe(function (m) { return console.log(m); });
        this.getMyCards();
        this.addCard();
        this.websocketService.getCard(this.auth.getCurrentUser().username).subscribe(function (card) {
            console.log(card.toString());
        });
        this.getSuit();
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
            _this.baralhoJogadores.push(m.card);
        });
    };
    TableComponent.prototype.addCard = function () {
        this.websocketService.getCard(this.auth.getCurrentUser().username).subscribe(function (m) {
            console.log(m._img);
        });
    };
    TableComponent.prototype.getSuit = function () {
        var _this = this;
        console.log("get trunfo");
        this.websocketService.getSuit({ room: this.room }).subscribe(function (m) {
            //console.log("Trunfo é: " + m.toString());
            _this.suit = m;
        });
    };
    TableComponent.prototype.cleanMesa = function () {
        this.mesa = new mesa_1.Mesa();
        this.error = '';
    };
    TableComponent.prototype.getCardBaralho = function (card) {
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].tipoCard == card.tipoCard && this.cards[i].simbolo == card.simbolo) {
                this.websocketService.sendCard({ username: this.auth.getCurrentUser().username, card: this.cards[i] });
            }
        }
    };
    TableComponent.prototype.countCards = function () {
        var count = 0;
        for (var i = 0; i < this.mesa.cards.length; i++) {
            count += this.mesa.cards[i].ponto;
        }
        //console.log(count);
        return count;
    };
    TableComponent.prototype.checkCheating = function () {
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