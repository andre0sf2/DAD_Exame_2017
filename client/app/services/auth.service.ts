import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import {User} from '../model/user';

@Injectable()
export class AuthService {
    currentUser: User;

    constructor(private http: Http) {
    }

    login(username: string, password: string): Observable<User> {
        let options = this.buildHeaders();

        return this.http.post('http://localhost:7777/api/v1/login',
            {username: username, password: password}, options)
            .map(res => {
                this.currentUser = <User>res.json();
                return this.currentUser;
            })
            .catch(e => {
                console.log(e);
                return Observable.of<User>(null);
            });
    }

    logout(): Observable<any> {
        let options = this.buildHeaders();
        return this.http.post('http://localhost:7777/api/v1/logout', null, options)
            .map(res => {
                res.json();
                this.currentUser = null;
                return this.currentUser;
            })
            .catch(e => {
                console.log(e);
                return Observable.throw(e);
            });
    }

    register(username: string, password: string, email: string): Observable<User> {
        return this.http.post('http://localhost:7777/api/v1/register', {
            username: username,
            password: password,
            email: email
        })
            .map(res => {
                return res.json();
            })
            .catch(e => {
                console.log(e);
                return Observable.throw(e);
            });
    }


    isLogged(): boolean {
        return this.currentUser != null ? true : false;
    }

    getCurrentUser(): User {
        return this.currentUser;
    }

    buildHeaders(): Headers {
        let headers = new Headers();
        headers.append('Authorization', 'bearer ' + this.currentUser.token);
        headers.append('Content-Type', 'application/json');

        return headers;
    }
}