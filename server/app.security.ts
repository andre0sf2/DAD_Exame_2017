import {User} from "../client/app/model/user";
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const sha1 = require('sha1');

import {databaseConnection as database} from './app.database';

export class Security {
    public passport = passport;

    public initMiddleware = (server: any) => {
        server.use(passport.initialize());
    };

    public authorize = this.passport.authenticate('bearer', {session: false});
}

let validPassword = (user: any, password: any) => {
    return sha1(password) === user.passwordHash;
}

passport.use(new LocalStrategy((username, password, done) => {
    database.db.collection('users').findOne({
        username: username
    }).then(user => {
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
        database.db.collection('users')
            .updateOne({_id: user._id}, {$set: {token: user.token}})
            .then(r => r.modifiedCount !== 1 ? done(null, false) : done(null, user))
            .catch(err => done(err));
    }).catch(err => done(err));
}));

passport.use(new BearerStrategy((token, done) => {
    database.db.collection('users')
        .findOne({token: token})
        .then((user) => user ? done(null, user, {scope: 'all'}) : done(null, false))
        .catch(err => done(err));
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

/* Facebook Auth */
let facebookAuth = {
    'clientID': '944505412318401', // facebook App ID
    'clientSecret': 'ad3de579cd766e02ef9afc98ee3e259c', // facebook App Secret
    'callbackURL': 'http://localhost:7777/api/v1/auth/facebook/callback'
};
passport.use(new FacebookStrategy({
        "clientID": facebookAuth.clientID,
        "clientSecret": facebookAuth.clientSecret,
        "callbackURL": facebookAuth.callbackURL
    },
    function (token, refreshToken, profile, done) {
        database.db.collection('users').findOne({
            fbID: profile.id
        }).then(user => {
            if (user === null) {
                // INSERT ONE
                let user = new User(profile.displayName, profile.email === undefined ? "" : profile.email, token, '', '');
                user.fbID = profile.id;

                database.db.collection('users')
                    .insertOne(user)
                    .then(r => r.modifiedCount !== 1 ? done(null, false) : done(null, user))
                    .catch(err => done(err));

            }

            database.db.collection('users')
                .updateOne({fbID: user.fbID}, {$set: {token: token}})
                .then(r => r.modifiedCount !== 1 ? done(null, false) : done(null, user))
                .catch(err => done(err));
        }).catch(err => done(err));
    }));