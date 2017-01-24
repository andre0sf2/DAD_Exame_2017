"use strict";
var io = require('socket.io');
var WebSocketServer = (function () {
    function WebSocketServer() {
        var _this = this;
        this.board = [];
        this.init = function (server) {
            //this.initBoard();
            _this.io = io.listen(server);
            _this.io.sockets.on('connection', function (client) {
                client.emit('players', Date.now() + ': Welcome to Sueca Online');
                client.broadcast.emit('players', Date.now() + ': A new player has arrived');
                client.on('lobby-chat', function (data) { return _this.io.emit('lobby-chat', data); });
                client.on('room-chat', function (data) { return _this.io.to(server.user.room).emit('room-chat', data); });
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
