import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';

import {User} from '../model/user';

@Injectable()
export class Top10Service{
    constructor(private http: Http){}

    private headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});

    bestPlayers : User[] = [];

    getTop10byStars():Observable<User[]>{
        return this.http.get('http://138.68.100.185:7777/api/v1/top/stars')
            .map(data => {
                this.bestPlayers = data.json();
                return this.bestPlayers;
            })
            .catch(erro=>{
                console.log(erro);
                return Observable.throw(erro);
            })
    }

    getTop10byPoints():Observable<User[]>{
        return this.http.get('http://138.68.100.185:7777/api/v1/top/points')
            .map(data => {
                this.bestPlayers = data.json();
                return this.bestPlayers;
            })
            .catch(erro=>{
                console.log(erro);
                return Observable.throw(erro);
            })
    }    

}