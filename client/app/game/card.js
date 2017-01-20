"use strict";
var Card = (function () {
    function Card(tipo, id, pontos) {
        this._tipoCard = tipo;
        this._simbolo = id;
        this._isAval = true;
        this._ponto = pontos;
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
    return Card;
}());
exports.Card = Card;
//# sourceMappingURL=card.js.map