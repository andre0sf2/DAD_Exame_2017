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
        this.init = function (server, settings) {
            server.post(settings.prefix + 'login', settings.security.passport.authenticate('local', { 'session': false }), _this.login);
            server.post(settings.prefix + 'logout', settings.security.authorize, _this.logout);
            _this.initFacebookRoutes(server, settings);
            _this.initGithubRoutes(server, settings);
            _this.initGoogleRoutes(server, settings);
            console.log("Authentication routes registered");
        };
    }
    Authentication.prototype.initGoogleRoutes = function (server, settings) {
        server.get(settings.prefix + "auth/google", settings.security.passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/plus.login',
                'https://www.googleapis.com/auth/plus.profile.emails.read']
        }));
        server.get("http://127.0.0.1:7777/api/v1/" + "auth/google/callback", settings.security.passport.authenticate("google", {
            failureRedirect: "http://127.0.0.1:3000/"
        }), function (req, res, next) {
            console.log(req.user);
            res.setHeader('Set-Cookie', 'user=' + req.user._id + '#' + req.user.token + ';Path=/');
            res.redirect('http://127.0.0.1:3000/home', next);
        });
        console.log("Google authentication routes registered");
    };
    Authentication.prototype.initGithubRoutes = function (server, settings) {
        server.get(settings.prefix + "auth/github", settings.security.passport.authenticate('github'));
        server.get(settings.prefix + "auth/github/callback", settings.security.passport.authenticate("github", {
            failureRedirect: "http://localhost:3000/"
        }), function (req, res, next) {
            console.log(req.user);
            res.setHeader('Set-Cookie', 'user=' + req.user._id + '#' + req.user.token + ';Path=/');
            res.redirect('http://localhost:3000/home', next);
        });
        console.log("Github authentication routes registered");
    };
    Authentication.prototype.initFacebookRoutes = function (server, settings) {
        // send to facebook to do the authentication
        server.get(settings.prefix + "auth/facebook", settings.security.passport.authenticate("facebook", { scope: "public_profile,email" }));
        // handle the callback after facebook has authenticated the user
        server.get(settings.prefix + "auth/facebook/callback", settings.security.passport.authenticate("facebook", {
            failureRedirect: "http://localhost:3000/"
        }), function (req, res, next) {
            console.log(req.user);
            res.setHeader('Set-Cookie', 'user=' + req.user._id + '#' + req.user.token + ';Path=/');
            res.redirect('http://localhost:3000/home', next);
        });
        console.log("Facebook authentication routes registered");
    };
    return Authentication;
})();
exports.Authentication = Authentication;
