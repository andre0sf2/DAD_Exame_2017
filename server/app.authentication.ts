import {HandlerSettings} from './handler.settings';

export class Authentication {

    public login = (request: any, response: any, next: any) => {
        console.log(request.user);
        let user = request.user;
        response.json(user);
        return next();
    }

    public logout = (request: any, response: any, next: any) => {
        request.logout();
        response.json({msg: 'Logout'});
        return next();
    }

    public init = (server: any, settings: HandlerSettings) => {
        server.post(settings.prefix + 'login', settings.security.passport.authenticate('local', {'session': false}), this.login);
        server.post(settings.prefix + 'logout', settings.security.authorize, this.logout);

        server.get('/auth/facebook',
            settings.security.passport.authenticate('facebook', {scope: 'email'}
            ));

        server.get('/auth/facebook/callback',
            settings.security.passport.authenticate('facebook', {
                successRedirect: 'http://localhost:3000/home',
                failureRedirect: '/login'
            })
        );

        console.log("Authentication routes registered");
    }
} 

