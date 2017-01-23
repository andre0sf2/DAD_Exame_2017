const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const sha1 = require('sha1');

import {databaseConnection as database} from './app.database';

export class Security {
    public passport = passport;

    public initMiddleware = (server : any) => {
        server.use(passport.initialize());
    };

    public authorize = this.passport.authenticate('bearer', { session: false });
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
        user.token = sha1(user.username+ Date.now());
        database.db.collection('users')
            .updateOne({_id: user._id}, {$set: {token: user.token}})
            .then(r => r.modifiedCount !== 1 ? done(null, false) : done(null, user))
            .catch(err => done(err));
    }).catch(err => done(err));
}));

passport.use(new BearerStrategy((token, done) => {
    database.db.collection('users')
        .findOne({token: token})
        .then((user) => user ? done(null, user, {scope:'all'}) : done(null, false))
        .catch(err => done(err));
}));

const FacebookID = '944505412318401';
const FacebookSecret = 'ad3de579cd766e02ef9afc98ee3e259c';
passport.use(new FacebookStrategy({
        clientID: FacebookID,
        clientSecret: FacebookSecret,
        callbackURL: "http://localhost:7777/auth/facebook/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        // you email, name, id, and so on is on profile
        let result = profile;
        console.log("FB " + profile.emails[0].value);

    }
));