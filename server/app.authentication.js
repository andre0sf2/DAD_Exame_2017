"use strict";
var Authentication = (function () {
    function Authentication() {
        var _this = this;
        this.login = function (request, response, next) {
            console.log(request.user);
            var user = request.user;
            response.json(user);
            return next();
        };
        this.logout = function (request, response, next) {
            request.logout();
            response.json({ msg: 'Logout' });
            return next();
        };
        this.facebookSuccess = function (request, response, next) {
            //request.logout();
            console.log("FB WORKING");
            response.json({ msg: 'Facebook Auth' });
            return next();
        };
        this.facebookFailure = function (request, response, next) {
            //request.logout();
            console.log("FB NOT WORKING");
            response.json({ msg: 'Facebook Auth Failure' });
            return next();
        };
        this.init = function (server, settings) {
            server.post(settings.prefix + 'login', settings.security.passport.authenticate('local', { 'session': false }), _this.login);
            server.post(settings.prefix + 'logout', settings.security.authorize, _this.logout);
            server.get('/auth/facebook', settings.security.passport.authenticate('facebook', { scope: 'email' }));
            server.get('/auth/facebook/callback', settings.security.passport.authenticate('facebook', {
                successRedirect: _this.facebookSuccess,
                failureRedirect: _this.facebookFailure
            }));
            console.log("Authentication routes registered");
        };
    }
    return Authentication;
}());
exports.Authentication = Authentication;
