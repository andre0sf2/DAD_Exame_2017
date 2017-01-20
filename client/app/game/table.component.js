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
var websocket_service_1 = require("../websocket/websocket.service");
var router_1 = require("@angular/router");
var auth_service_1 = require("../services/auth.service");
var mesa_1 = require("./mesa");
var TableComponent = (function () {
    function TableComponent(websocketService, route, auth) {
        this.websocketService = websocketService;
        this.route = route;
        this.auth = auth;
        this.error = '';
        this.cards = [];
        this.adversarios = [];
        this.temAdversario = false;
        this.chatChannel = [];
        this.allReady = false;
        this.isMyTurn = false;
    }
    TableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.cards = [];
        this.websocketService.getChatMessagesOnRoom().subscribe(function (m) { return _this.chatChannel.push(m); });
        this.route.params.subscribe(function (params) {
            _this.room = params['room'];
        });
        this.websocketService.getAllPlayersReady().subscribe(function (r) {
            console.log(r);
            _this.allReady = true;
        });
        this.websocketService.getTurn().subscribe(function (r) {
            //r = username
            if (r === _this.auth.getCurrentUser().username) {
                _this.error = 'My turn!';
                _this.isMyTurn = true;
            }
            else {
                _this.isMyTurn = false;
                _this.error = 'Player turn!: ' + r;
            }
        });
        this.websocketService.getDerrotado().subscribe(function (r) {
            if (_this.auth.getCurrentUser().username == r.usernameAlvo) {
                console.log("Derrotado");
                _this.error = 'Fui derrotado';
            }
        });
        this.mesa = new mesa_1.Mesa();
        this.cards = this.mesa.cards;
    };
    TableComponent.prototype.addCard = function () {
    };
    TableComponent.prototype.cleanMesa = function () {
        this.mesa = new mesa_1.Mesa();
        this.error = '';
    };
    TableComponent.prototype.putImage = function (naipe, simbolo) {
        var mesa = new mesa_1.Mesa();
        var card = this.mesa.getCard(naipe, simbolo);
        return '../../cards-1/' + card.tipoCard + card.simbolo + ".png";
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
    __metadata("design:paramtypes", [websocket_service_1.WebSocketService, router_1.ActivatedRoute, auth_service_1.AuthService])
], TableComponent);
exports.TableComponent = TableComponent;
//# sourceMappingURL=table.component.js.map