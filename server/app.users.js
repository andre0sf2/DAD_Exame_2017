"use strict";
var mongodb = require('mongodb');
var util = require('util');
var app_database_1 = require('./app.database');
var User = (function () {
    function User() {
        var _this = this;
        this.settings = null;
        this.handleError = function (err, response, next) {
            response.send(500, err);
            next();
        };
        this.returnUser = function (id, response, next) {
            app_database_1.databaseConnection.db.collection('users')
                .findOne({
                _id: id
            })
                .then(function (user) {
                if (user === null) {
                    response.send(404, 'User not found');
                }
                else {
                    response.json(user);
                }
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getUsers = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('users')
                .find()
                .toArray()
                .then(function (players) {
                response.json(players || []);
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getUser = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            _this.returnUser(id, response, next);
        };
        this.updateUser = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            var user = request.body;
            if (user === undefined) {
                response.send(400, 'No user data');
                return next();
            }
            delete user._id;
            app_database_1.databaseConnection.db.collection('users')
                .updateOne({
                _id: id
            }, {
                $set: user
            })
                .then(function (result) { return _this.returnUser(id, response, next); })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.createUser = function (request, response, next) {
            var user = request.body;
            if (user === undefined) {
                response.send(400, 'No user data');
                return next();
            }
            app_database_1.databaseConnection.db.collection('users')
                .insertOne(user)
                .then(function (result) { return _this.returnUser(result.insertedId, response, next); })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.deleteUser = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            app_database_1.databaseConnection.db.collection('users')
                .deleteOne({
                _id: id
            })
                .then(function (result) {
                if (result.deletedCount === 1) {
                    response.json({
                        msg: util.format('User -%s- Deleted', id)
                    });
                }
                else {
                    response.send(404, 'No user found');
                }
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getTop10 = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('users')
                .find()
                .sort({ totalVictories: -1 })
                .limit(10)
                .toArray()
                .then(function (players) {
                response.json(players || []);
                _this.settings.wsServer.notifyAll('users', Date.now() + ': Somebody accessed top 10');
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        // Routes for the games
        this.init = function (server, settings) {
            _this.settings = settings;
            server.get(settings.prefix + 'top10', _this.getTop10);
            server.get(settings.prefix + 'users', settings.security.authorize, _this.getUsers);
            server.get(settings.prefix + 'users/:id', settings.security.authorize, _this.getUser);
            server.put(settings.prefix + 'users/:id', settings.security.authorize, _this.updateUser);
            server.post(settings.prefix + 'register', _this.createUser);
            server.del(settings.prefix + 'users/:id', settings.security.authorize, _this.deleteUser);
            console.log("Users routes registered");
        };
    }
    return User;
}());
exports.User = User;
