/**
 * Created by joao on 18-01-2017.
 */

import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {User} from "../model/user";

@Injectable()
export class UserService {

    protected url = 'http://localhost:7777/api/v1/';
    protected headers = new Headers({'Content-Type':'application/json','Access-Control-Allow-Origin': '*'});
    protected options = (new RequestOptions()).headers = this.headers;

    constructor(private http: Http) {
    }

    register(user: User): Promise<any> {
        return this.http
            .post(this.url + 'register', user, this.options)
            .toPromise()
            .then(r => Promise.resolve(r.json()))
            .catch(r => Promise.resolve({error: true, message: 'internal error'}));
    }

}