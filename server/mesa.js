import { Card } from './card';
var Mesa = (function () {
    function Mesa() {
        var _this = this;
        this.gamers = [];
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
    }
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
})();
Mesa = Mesa;
