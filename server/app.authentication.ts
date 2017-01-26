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

        console.log("Authentication routes registered");
    };

    private initFacebookRoutes(server: any, settings: HandlerSettings) {
        // send to facebook to do the authentication
        server.get(settings.prefix + "auth/facebook", settings.security.passport.authenticate("facebook", {scope: "public_profile,email"}));
        // handle the callback after facebook has authenticated the user
        server.get(settings.prefix + "auth/facebook/callback",
            settings.security.passport.authenticate("facebook", {
                failureRedirect: "/"
            }),
            function (req, res, next) {

                res.redirect('http://localhost:3000/home', next);

            }
        );
        console.log("Facebook authentication routes registered");
    }
}


