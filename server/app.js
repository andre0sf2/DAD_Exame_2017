"use strict";
var restify = require('restify');
var passport = require('passport');
var path = require('path');
var app_database_1 = require("./app.database");
var app_websockets_1 = require("./app.websockets");
var handler_settings_1 = require("./handler.settings");
var url = 'mongodb://localhost:27017/sueca-proj';
// Create Restify and WebSocket Server
var restifyServer = restify.createServer();
var socketServer = new app_websockets_1.WebSocketServer();
// Prepare and configure Restify Server
restify.CORS.ALLOW_HEADERS.push("Content-Type");
restify.CORS.ALLOW_HEADERS.push("Authorization");
restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Origin");
restifyServer.use(restify.bodyParser());
restifyServer.use(restify.queryParser());
restifyServer.use(restify.CORS());
restifyServer.use(restify.fullResponse());
function checkMethodNotAllowedIsOptions(req, res) {
    if (req.method.toUpperCase() === 'OPTIONS') {
        var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Access-Control-Allow-Origin', 'Content-Type', 'Authorization'];
        if (res.methods.indexOf('OPTIONS') === -1) {
            res.methods.push('OPTIONS');
        }
        res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
        res.header('Access-Control-Allow-Methods', res.methods.join(', '));
        res.header('Access-Control-Allow-Origin', '*');
        return res.send(204);
    }
    else {
        return res.send(new restify.MethodNotAllowedError());
    }
}
restifyServer.on('MethodNotAllowed', checkMethodNotAllowedIsOptions);
// Prepare and configure Passport based security
var app_security_1 = require("./app.security");
var security = new app_security_1.Security();
security.initMiddleware(restifyServer);
// Settings are used on all HTTP (Restify) Handlers
var settings = new handler_settings_1.HandlerSettings(socketServer, security, '/api/v1/');
// Authentication Handlers
var app_authentication_1 = require("./app.authentication");
new app_authentication_1.Authentication().init(restifyServer, settings);
// Players Handler
var app_users_1 = require("./app.users");
new app_users_1.User().init(restifyServer, settings);
// Games Handler
var app_games_1 = require("./app.games");
new app_games_1.Game().init(restifyServer, settings);
restifyServer.get(/\/?.*/, restify.serveStatic({
    directory: __dirname.replace("server", "client"),
    default: 'index.html',
    match: /^((?!app.js).)*$/
}));
app_database_1.databaseConnection.connect(url, function () {
    restifyServer.listen(7777, function () { return console.log('%s listening at %s', restifyServer.name, restifyServer.url); });
    // Websocket is initialized after the server
    socketServer.init(restifyServer.server);
});
