"use strict";
var Game = (function () {
    function Game(_id, UserOwner, winner1, winner2, start, nplayers, finish, status, dateStart, dateFinish, players) {
        this._id = _id;
        this.UserOwner = UserOwner;
        this.winner1 = winner1;
        this.winner2 = winner2;
        this.start = start;
        this.nplayers = nplayers;
        this.finish = finish;
        this.status = status;
        this.dateStart = dateStart;
        this.dateFinish = dateFinish;
        this.players = players;
    }
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map