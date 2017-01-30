const restify = require('restify');
const passport = require('passport');
const path = require('path');

import {databaseConnection as database} from './app.database';
import {WebSocketServer} from './app.websockets';
import {HandlerSettings} from './handler.settings';

const url = 'mongodb://138.68.100.185:27017/sueca-proj';

// Create Restify and WebSocket Server
const restifyServer = restify.createServer();
const socketServer = new WebSocketServer();

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
import {Security} from './app.security';
let security = new Security();
security.initMiddleware(restifyServer);

// Settings are used on all HTTP (Restify) Handlers
let settings = new HandlerSettings(socketServer, security, '/api/v1/');

// Authentication Handlers
import {Authentication} from './app.authentication';
new Authentication().init(restifyServer, settings);


// Players Handler
import {User} from './app.users';
new User().init(restifyServer, settings);

// Games Handler
import {Game} from './app.games';
new Game().init(restifyServer, settings);

restifyServer.get(/\/?.*/, restify.serveStatic({
    directory: __dirname.replace("server", "client"),
    default: 'index.html',
    match: /^((?!app.js).)*$/
}));

database.connect(url, () => {
    restifyServer.listen(7777, () => console.log('%s listening at %s', restifyServer.name, restifyServer.url));
    // Websocket is initialized after the server
    socketServer.init(restifyServer.server);
});
