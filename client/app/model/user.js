/**
 * Created by joao on 16-01-2017.
 */
"use strict";
var User = (function () {
    function User(_username, _email, _token, _password, _passwordConfirmation) {
        this._username = _username;
        this._email = _email;
        this._token = _token;
        this._password = _password;
        this._passwordConfirmation = _passwordConfirmation;
        this.username = _username;
        this.email = _email;
        this.token = _token;
        this.totalStars = 0;
        this.totalPoints = 0;
        this.password = _password;
        this.passwordConfirmation = _passwordConfirmation;
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map