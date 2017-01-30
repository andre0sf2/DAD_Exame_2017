import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import { Game } from '../model/game';
import { User } from '../model/user';
import {Player} from "../../../server/app.websockets";

@Injectable()
export class GameService{
    constructor(private http: Http){}


    findMyGames(user : User): Observable<Game[]>{
        let headers = this.createHeaders(user.token);
        let myGames: Game[] = [];

        return this.http.get('http://138.68.100.185:7777/api/v1/games', headers)
            .map(resource => {
                resource.json().forEach((game:Game)=>{
                    if(game.UserOwner == user._id.toString()){
                        myGames.push(game);
                    }
                });
                return myGames;
            })
            .catch(error => {
                return Observable.throw(error);
            });

    }


    findPlayingGames(user: User): Observable<Game[]> {
        let headers = this.createHeaders(user.token);
        let ongoingGames: Game[] = [];

        return this.http.get('http://138.68.100.185:7777/api/v1/games', headers)
            .map(resource => {
                resource.json().forEach((game:Game)=>{
                    let i:number;
                    for (i = 0; i<game.players.length; i++) {
                        if (game.players[i].player == user._id) {
                            ongoingGames.push(game);
                            console.log(ongoingGames);
                        }
                    }

                });

                return ongoingGames;
            })
            .catch(error => {
                return Observable.throw(error);
            });
    }

    findOtherGames(user : User): Observable<Game[]>{
        let headers = this.createHeaders(user.token);
        let otherGames: Game[] = [];

        return this.http.get('http://138.68.100.185:7777/api/v1/games', headers)
            .map(resource => {
                resource.json().forEach((game:Game)=>{
                    if(game.UserOwner != user._id.toString() && game.status == 'on lobby'){
                        otherGames.push(game);
                    }
                });
                return otherGames;
            })
            .catch(error => {
                return Observable.throw(error);
            });

    }
    
   createGame(user: User): Observable<string>{
        let headers = this.createHeaders(user.token);
        console.log(user._id);
        return this.http.post('http://138.68.100.185:7777/api/v1/games', {
	        UserOwner: user._id,
            UsernameOwner: user.username,
	        finish: '',
	        status: 'on lobby',
            nplayers: 1,
	        players: [{
		        player: user._id,
		        points: 0
	        }]
        },headers)
        .map(resource=>{
            return resource.json();
        })
        .catch(error=>{
            return Observable.throw(error);
        })
    }
    
    deleteGame(game: Game, user: User){
        let headers = this.createHeaders(user.token);
        return this.http.delete('http://138.68.100.185:7777/api/v1/games/'+ game._id, headers)
        .map(response => {
            return response.json();
        })
        .catch(error=>{
            return Observable.throw(error);
        });
    }

    updateGame(game:Game, user : User) : Observable<Game>{
        let headers = this.createHeaders(user.token);

        return this.http.put('http://138.68.100.185:7777/api/v1/games/' + game._id, JSON.stringify(game), headers)
            .map(response => {
                return response.json();
            })
            .catch(error=>{ 
                return Observable.throw(error);
            });
    }

    createHeaders(token:string): RequestOptions{
        let headers = new Headers();
        headers.append('Authorization', 'bearer '+ token);
        headers.append('Content-Type', 'application/json');
        return new RequestOptions({headers:headers});
    }

    getAllGames(): Observable<Game[]>{
        let publicHeaders = new Headers({'Content-Type': 'application/json'});

        return this.http.get('http://138.68.100.185:7777/api/v1/allgames', publicHeaders)
        .map (response => {
            return response.json();
        })
        .catch(error=>{
            return Observable.throw(error);
        });
    }

    getMyGames(user: User): Observable<Game[]>{
        let publicHeaders = new Headers({'Content-Type': 'application/json'});
        let games : Game[] = [];

        return this.http.get('http://138.68.100.185:7777/api/v1/allgames', publicHeaders)
        .map (response => {
            response.json().forEach((game:Game)=>{
                game.players.forEach((p: User)=> {
                    //console.log(p.username + "SADKDS");
                    //console.log(user.username);
                    if(p.username == user.username){
                        games.push(game);
                    }                    
                });
            });
            return games;
        })
        .catch(error=>{
            return Observable.throw(error);
        });
    }

    getGame(room: any): Observable<Game>{
        let publicHeaders = new Headers({'Content-Type': 'application/json'});
        let game : Game;

        return this.http.get('http://138.68.100.185:7777/api/v1/games/'+room, publicHeaders)
            .map (response => {
                return response.json();
            })
            .catch(error=>{
                return Observable.throw(error);
            });
    }

}