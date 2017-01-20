/**
 * Created by joao on 18-01-2017.
 */

import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import {User} from '../model/user';

const url = 'http://localhost:7777/api/v1/';

@Injectable()
export class AuthService {

    constructor(private http: Http) {
    }

    login(user: any): Observable<User> {
        let options = this.buildHeaders();

        return this.http.post(url + 'login', user, options)
            .map(res => {
                localStorage.setItem('user', JSON.stringify(<User>res.json()) )
                return this.getCurrentUser();
            })
            .catch(e => {
                console.log(e);
                return Observable.of<User>(null);
            });
    }



    logout() {

        let options = this.buildHeadersWithAuthorization();

        return this.http.post('http://localhost:7777/api/v1/logout', null, {headers: options})
            .map(res => {
                res.json();
                localStorage.removeItem('user');
            })
            .catch(e => {
                console.log(e);
                return Observable.throw(e);
            });
    }


    register(user: User): Promise<User> {
        let options = this.buildHeaders();

        return this.http
            .post(url + 'register', user, options)
            .toPromise()
            .then(r => Promise.resolve(r.json()))
            .catch(r => Promise.resolve({error: true, message: 'internal error'}));
    }


    isLogged(): boolean {
        return this.getCurrentUser() != null ? true : false;
    }

    getCurrentUser(): User {
        return JSON.parse(localStorage.getItem('user'));
    }

    buildHeaders(): Headers {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return headers;
    }

    buildHeadersWithAuthorization(): Headers {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Authorization', 'Bearer ' + this.getCurrentUser().token);

        return headers;
    }
}