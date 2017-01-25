"use strict";
var mongodb = require('mongodb');
var util = require('util');
var sha1 = require('sha1');
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
            app_database_1.databaseConnection.db.collection('users')
                .findOne({ username: request.body.username })
                .then(function (user) {
                console.log("User is: " + request.body.username);
                if (user !== null) {
                    console.log("User already exists so...");
                    response.json({
                        msg: util.format('Username already exists')
                    });
                }
                else {
                    var user_1 = request.body;
                    if (user_1 === undefined) {
                        response.send(400, 'No user data');
                        return next();
                    }
                    user_1.username = request.body.username;
                    user_1.passwordHash = sha1(request.body.password);
                    user_1.email = request.body.email;
                    delete user_1.password;
                    delete user_1.passwordConfirmation;
                    console.log("DEBUG: insert user... " + user_1);
                    app_database_1.databaseConnection.db.collection('users')
                        .insertOne(user_1)
                        .then(function (result) { return _this.returnUser(result.insertedId, response, next); })
                        .catch(function (err) {
                        return _this.handleError(err, response, next);
                    });
                }
            })
                .catch(function (err) {
                console.log(err);
                _this.handleError(err, response, next);
            });
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
        this.getTop10byPoints = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('users')
                .find()
                .sort({ totalPoints: -1 })
                .limit(10)
                .toArray()
                .then(function (users) {
                response.json(users || []);
                _this.settings.wsServer.notifyAll('users', 'Top 10 by Points has been accessed');
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getTop10byStars = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('users')
                .find()
                .sort({ totalStars: -1 })
                .limit(10)
                .toArray()
                .then(function (users) {
                response.json(users || []);
                _this.settings.wsServer.notifyAll('users', 'Top 10 by Stars has been accessed');
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getTop10 = function (request, response, next) {
            switch (request.params.type) {
                case 'stars':
                    _this.getTop10byStars(request, response, next);
                    break;
                case 'points':
                    _this.getTop10byPoints(request, response, next);
                    break;
            }
        };
        // Routes for the games
        this.init = function (server, settings) {
            _this.settings = settings;
            server.get(settings.prefix + 'top/:type', _this.getTop10);
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
