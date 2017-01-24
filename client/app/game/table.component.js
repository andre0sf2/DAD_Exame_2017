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
    function TableComponent(route, auth, websocketService) {
        this.route = route;
        this.auth = auth;
        this.websocketService = websocketService;
        this.error = '';
        this.cards = [];
        this.baralhoJogadores = [];
        this.adversarios = [];
        this.temAdversario = false;
        this.chatChannel = [];
        this.allReady = false;
        this.isMyTurn = false;
    }
    TableComponent.prototype.ngOnInit = function () {
        this.cards = [];
        this.websocketService.getGamePlayers().subscribe(function (m) { return console.log(m); });
        this.getCards();
        /*this.websocketService.getChatMessagesOnRoom().subscribe((m: any) => this.chatChannel.push(<string>m));

        this.route.params.subscribe(params => {
            this.room = params['room'];
        });

        this.websocketService.getAllPlayersReady().subscribe((r: any) => {
            console.log(r);
            this.allReady = true;
        });

        this.websocketService.getTurn().subscribe((r: string) => {
            //r = username
            if (r === this.auth.getCurrentUser().username) {
                this.error = 'My turn!';
                this.isMyTurn = true;
            } else {
                this.isMyTurn = false;
                this.error = 'Player turn!: ' + r;
            }
        });

        this.websocketService.getDerrotado().subscribe((r: any) => {
            if (this.auth.getCurrentUser().username == r.usernameAlvo) {
                console.log("Derrotado");
                this.error = 'Fui derrotado';
            }
        });
*/
        this.mesa = new mesa_1.Mesa();
        this.cards = this.mesa.cards;
        this.baralharCartas(this.cards);
    };
    TableComponent.prototype.getCards = function () {
        console.log("entrou");
        this.websocketService.getMyCards({ username: this.auth.getCurrentUser().username }).subscribe(function (m) { return console.log(m); });
    };
    TableComponent.prototype.addCard = function () {
        this.mesa.getCard("o", 2);
    };
    TableComponent.prototype.cleanMesa = function () {
        this.mesa = new mesa_1.Mesa();
        this.error = '';
    };
    TableComponent.prototype.countCards = function () {
        var count = 0;
        for (var i = 0; i < this.mesa.cards.length; i++) {
            count += this.mesa.cards[i].ponto;
        }
        console.log(count);
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
        console.log(this.cards);
    };
    return TableComponent;
}());
TableComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'table-game',
        templateUrl: 'table.component.html',
        styleUrls: ['table.component.css']
    }),
    __metadata("design:paramtypes", [router_1.Router, auth_service_1.AuthService, websocket_service_1.WebSocketService])
], TableComponent);
exports.TableComponent = TableComponent;
//# sourceMappingURL=table.component.js.map