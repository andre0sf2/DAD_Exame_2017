import {Security} from "./app.security";
const mongodb = require('mongodb');
const util = require('util');
import {HandlerSettings} from './handler.settings';
import {databaseConnection as database} from './app.database';

export class User {

    private settings: HandlerSettings = null;

    private handleError = (err: string, response: any, next: any) => {
    	response.send(500, err);
	    next();
    }

    private returnUser = (id:string, response: any, next: any) => {
        database.db.collection('users')
            .findOne({
                _id: id
            })
            .then((user) => {
                if (user === null) {
                    response.send(404, 'User not found');
                } else {
                    response.json(user);
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getUsers = (request: any, response: any, next: any) => {
        database.db.collection('users')
            .find()
            .toArray()
            .then(players => {
                response.json(players || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getUser =  (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);
        this.returnUser(id, response, next);
    }
    
    public updateUser = (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);
        const user = request.body;

        if (user === undefined) {
            response.send(400, 'No user data');
            return next();
        }
        delete user._id;
        database.db.collection('users')
            .updateOne({
                _id: id
            }, {
                $set: user
            })
            .then(result => this.returnUser(id, response, next))
            .catch(err => this.handleError(err, response, next));
    }
    
    public createUser = (request: any, response: any, next: any) => {
        const user = request.body;
        if (user === undefined) {
            response.send(400, 'No user data');
            return next();
        }

        database.db.collection('users')
            .insertOne(user)
            .then(result => this.returnUser(result.insertedId, response, next))
            .catch(err => this.handleError(err, response, next));

    }

    public deleteUser = (request: any, response: any, next: any) => {
        var id = new mongodb.ObjectID(request.params.id);
        database.db.collection('users')
            .deleteOne({
                _id: id
            })
            .then(result => {
                if (result.deletedCount === 1) {
                    response.json({
                        msg: util.format('User -%s- Deleted', id)
                    });
                } else {
                    response.send(404, 'No user found');
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getTop10byPoints = (request: any, response: any, next: any) => {
        database.db.collection('users')
            .find()
            .sort({totalPoints:-1})
            .limit(10)
            .toArray()
            .then(users => {
                response.json(users || []);
                this.settings.wsServer.notifyAll('users', 'Top 10 by Points has been accessed');
                next();
            })
            .catch(err => this.handleError(err,response,next));

    }

    public getTop10byStars = (request: any, response: any, next:any ) => {
        database.db.collection('users')
            .find()
            .sort({totalStars:-1})
            .limit(10)
            .toArray()
            .then(users => {
                response.json(users || []);
                this.settings.wsServer.notifyAll('users', 'Top 10 by Stars has been accessed');
                next();
            })
            .catch(err => this.handleError(err,response,next));
    }   

        public getTop10 = (request: any, response: any, next:any ) => {

                switch (request.params.type) {
                    case 'stars':
                        this.getTop10byStars(request, response, next);
                        break;
                    case 'points':
                        this.getTop10byPoints(request, response, next);
                        break;
                }
        
    } 

     /*   
    public getTop10 = (request: any, response: any, next: any) => {
        database.db.collection('users')
            .find()
            .sort({totalVictories:-1})
            .limit(10)
            .toArray()
            .then(players => {
                response.json(players || []);
                this.settings.wsServer.notifyAll('users', Date.now() + ': Somebody accessed top 10');
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }
*/
    // Routes for the games
    public init = (server: any, settings: HandlerSettings) => {
        this.settings = settings;
        server.get(settings.prefix + 'top/:type', this.getTop10);
        server.get(settings.prefix + 'users', settings.security.authorize, this.getUsers);
        server.get(settings.prefix + 'users/:id', settings.security.authorize, this.getUser);
        server.put(settings.prefix + 'users/:id', settings.security.authorize, this.updateUser);
        server.post(settings.prefix + 'register', this.createUser);
        server.del(settings.prefix + 'users/:id', settings.security.authorize, this.deleteUser);
        console.log("Users routes registered");

    };
}