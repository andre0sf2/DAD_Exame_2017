/**
 * Created by joao on 18-01-2017.
 */

import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {User} from "../model/user";

@Injectable()
export class UserService {

    protected url = 'http://138.68.100.185:7777/api/v1/';

    constructor(private http: Http) {
    }

    getUserToLocalStorage(id: string, token: string): any {
        this.http.get(this.url + 'users/' + id)
            .toPromise()
            .then(user => {
                localStorage.setItem('user', JSON.stringify(<User>user.json()) )
            })
            .catch(r => Promise.resolve({error: true, message: 'Internal error, try again later.'}));

    }

    buildHeadersWithAuthorization(token: string): Headers {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);

        return headers;
    }

}