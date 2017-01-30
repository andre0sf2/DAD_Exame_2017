/**
 * Created by joao on 16-01-2017.
 */
"use strict";
var User = (function () {
    function User(_username, _email, _token, _password, _passwordConfirmation, _profilePic, _fbID, _githubID, _googleID) {
        this._username = _username;
        this._email = _email;
        this._token = _token;
        this._password = _password;
        this._passwordConfirmation = _passwordConfirmation;
        this._profilePic = _profilePic;
        this._fbID = _fbID;
        this._githubID = _githubID;
        this._googleID = _googleID;
        this.fbID = _fbID;
        this.githubID = _githubID;
        this.googleID = _googleID;
        this.username = _username;
        this.email = _email;
        this.token = _token;
        this.totalStars = 0;
        this.totalPoints = 0;
        this.password = _password;
        this.passwordConfirmation = _passwordConfirmation;
        this.profilePic = _profilePic;
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map