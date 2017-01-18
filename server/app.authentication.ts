import {HandlerSettings} from './handler.settings';

export class Authentication{
   
    public login = (request: any, response: any, next: any) => {
        console.log(request.user);
        let user = request.user;
        response.json(user);
        return next();
    }

    public logout = (request: any, response: any, next: any) => {
        request.logOut();
        response.json({msg: 'Logout'});
        return next();
    }  

    public init = (server: any, settings: HandlerSettings) => {
        server.post(settings.prefix + 'login', settings.security.passport.authenticate('local', {'session':false}), this.login);
        server.post(settings.prefix + 'logout', settings.security.authorize, this.logout);
        console.log("Authentication routes registered");
    }  
} 

