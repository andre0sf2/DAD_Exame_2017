import {HandlerSettings} from './handler.settings';

export class Authentication {

    public login = (request: any, response: any, next: any) => {
        console.log(request.user);
        let user = request.user;
        response.json(user);
        return next();
    };

    public logout = (request: any, response: any, next: any) => {
        request.logout();
        response.json({msg: 'Logout'});
        return next();
    };

    public init = (server: any, settings: HandlerSettings) => {
        server.post(settings.prefix + 'login', settings.security.passport.authenticate('local', {'session': false}), this.login);
        server.post(settings.prefix + 'logout', settings.security.authorize, this.logout);

        this.initFacebookRoutes(server, settings);
        this.initGithubRoutes(server, settings);
        this.initGoogleRoutes(server, settings);

        console.log("Authentication routes registered");
    };

    private initGoogleRoutes(server: any, settings: HandlerSettings) {
        server.get(settings.prefix + "auth/google",
            settings.security.passport.authenticate('google', {
                scope: ['https://www.googleapis.com/auth/plus.login',
                    'https://www.googleapis.com/auth/plus.profile.emails.read']
            })
        );

        server.get(settings.prefix + + "auth/google/callback",
            settings.security.passport.authenticate("google", {
                failureRedirect: "/login"
            }),
            function (req, res, next) {
                console.log(req.user);

                res.setHeader('Set-Cookie', 'user=' + req.user._id + '#' + req.user.token + ';Path=/');
                res.redirect('/', next);

            }
        );

        console.log("Google authentication routes registered");
    }

    private initGithubRoutes(server: any, settings: HandlerSettings) {

        server.get(settings.prefix + "auth/github",
            settings.security.passport.authenticate('github')
        );

        server.get(settings.prefix + "auth/github/callback",
            settings.security.passport.authenticate("github", {
                failureRedirect: "/login"
            }),
            function (req, res, next) {
                console.log(req.user);

                res.setHeader('Set-Cookie', 'user=' + req.user._id + '#' + req.user.token + ';Path=/');
                res.redirect('/', next);

            }
        );

        console.log("Github authentication routes registered");

    }

    private initFacebookRoutes(server: any, settings: HandlerSettings) {
        // send to facebook to do the authentication
        server.get(settings.prefix + "auth/facebook", settings.security.passport.authenticate("facebook", {scope: "public_profile,email"}));
        // handle the callback after facebook has authenticated the user
        server.get(settings.prefix + "auth/facebook/callback",
            settings.security.passport.authenticate("facebook", {
                failureRedirect: "/login"
            }),
            function (req, res, next) {
                console.log(req.user);

                res.setHeader('Set-Cookie', 'user=' + req.user._id + '#' + req.user.token + ';Path=/');
                res.redirect('/', next);

            }
        );
        console.log("Facebook authentication routes registered");
    }
}