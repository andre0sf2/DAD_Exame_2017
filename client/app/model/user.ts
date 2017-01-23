/**
 * Created by joao on 16-01-2017.
 */

export class User {
    _id: string;
    username: string;
    email: string;
    passwordHash: string;
    totalStars: number;
    totalPoints: number;
    token: string;
    password: string;
    passwordConfirmation: string;


    constructor(public _username: string,
                public _email: string,
                public _token: string,
                private _password?: string,
                private _passwordConfirmation?: string,) {
        this.username = _username;
        this.email = _email;
        this.token = _token;
        this.totalStars = 0;
        this.totalPoints = 0;
        this.password = _password;
        this.passwordConfirmation = _passwordConfirmation;
    }
}