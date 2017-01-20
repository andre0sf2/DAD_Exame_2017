"use strict";
var card_1 = require("./card");
var Mesa = (function () {
    function Mesa() {
        var _this = this;
        this.cards = [];
        Mesa.todosOsNaipes().forEach(function (naipe) {
            Mesa.todosOsSimbolos().forEach(function (simbolo) {
                var c = null;
                switch (simbolo) {
                    case 1:
                        c = new card_1.Card(naipe, simbolo, 11);
                        break;
                    case 7:
                        c = new card_1.Card(naipe, simbolo, 10);
                        break;
                    case 13:
                        c = new card_1.Card(naipe, simbolo, 4);
                        break;
                    case 11:
                        c = new card_1.Card(naipe, simbolo, 3);
                        break;
                    case 12:
                        c = new card_1.Card(naipe, simbolo, 2);
                        break;
                    default: c = new card_1.Card(naipe, simbolo, 0);
                }
                _this.cards.push(c);
            });
        });
    }
    Mesa.prototype.getCard = function (naipe, simbolo) {
        for (var i = 0; i < 40; i++) {
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
//# sourceMappingURL=mesa.js.map