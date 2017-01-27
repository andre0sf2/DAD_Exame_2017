/**
 * Created by joao on 16-01-2017.
 */

export class User {
    _id: string;
    public fbID: number;
    username: string;
    email: string;
    passwordHash: string;
    totalStars: number;
    totalPoints: number;
    token: string;
    password: string;
    passwordConfirmation: string;
    profilePic: string;


    constructor(public _username: string,
                public _email: string,
                public _token: string,
                public _password?: string,
                public _passwordConfirmation?: string,
                public _profilePic?: string,
                public _fbID?: number) {
        this.fbID = _fbID;
        this.username = _username;
        this.email = _email;
        this.token = _token;
        this.totalStars = 0;
        this.totalPoints = 0;
        this.password = _password;
        this.passwordConfirmation = _passwordConfirmation;
        this.profilePic = _profilePic;
    }

}