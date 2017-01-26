"use strict";
var user_1 = require("../client/app/model/user");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var sha1 = require('sha1');
var app_database_1 = require('./app.database');
var Security = (function () {
    function Security() {
        this.passport = passport;
        this.initMiddleware = function (server) {
            server.use(passport.initialize());
        };
        this.authorize = this.passport.authenticate('bearer', { session: false });
    }
    return Security;
}());
exports.Security = Security;
var validPassword = function (user, password) {
    return sha1(password) === user.passwordHash;
};
passport.use(new LocalStrategy(function (username, password, done) {
    app_database_1.databaseConnection.db.collection('users').findOne({
        username: username
    }).then(function (user) {
        console.log("debug: " + user);
        if (user === null) {
            return done(null, false, {
                message: 'Incorrect credentials.'
            });
        }
        if (!validPassword(user, password)) {
            return done(null, false, {
                message: 'Incorrect credentials.'
            });
        }
        user.token = sha1(user.username + Date.now());
        app_database_1.databaseConnection.db.collection('users')
            .updateOne({ _id: user._id }, { $set: { token: user.token } })
            .then(function (r) { return r.modifiedCount !== 1 ? done(null, false) : done(null, user); })
            .catch(function (err) { return done(err); });
    }).catch(function (err) { return done(err); });
}));
passport.use(new BearerStrategy(function (token, done) {
    app_database_1.databaseConnection.db.collection('users')
        .findOne({ token: token })
        .then(function (user) { return user ? done(null, user, { scope: 'all' }) : done(null, false); })
        .catch(function (err) { return done(err); });
}));
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
/* Facebook Auth */
var facebookAuth = {
    'clientID': '944505412318401',
    'clientSecret': 'ad3de579cd766e02ef9afc98ee3e259c',
    'callbackURL': 'http://localhost:7777/api/v1/auth/facebook/callback'
};
passport.use(new FacebookStrategy({
    "clientID": facebookAuth.clientID,
    "clientSecret": facebookAuth.clientSecret,
    "callbackURL": facebookAuth.callbackURL
}, function (token, refreshToken, profile, done) {
    app_database_1.databaseConnection.db.collection('users').findOne({
        fbID: profile.id
    }).then(function (user) {
        if (user === null) {
            // INSERT ONE
            var user_2 = new user_1.User(profile.displayName, profile.email === undefined ? "" : profile.email, token, '', '');
            user_2.fbID = profile.id;
            app_database_1.databaseConnection.db.collection('users')
                .insertOne(user_2)
                .then(function (r) { return r.modifiedCount !== 1 ? done(null, false) : done(null, user_2); })
                .catch(function (err) { return done(err); });
        }
        app_database_1.databaseConnection.db.collection('users')
            .updateOne({ fbID: user.fbID }, { $set: { token: token } })
            .then(function (r) { return r.modifiedCount !== 1 ? done(null, false) : done(null, user); })
            .catch(function (err) { return done(err); });
    }).catch(function (err) { return done(err); });
}));
