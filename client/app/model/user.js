/**
 * Created by joao on 16-01-2017.
 */
"use strict";
var User = (function () {
    function User(_id, username, email, token, totalStars, totalPoints, password, passwordConfirmation) {
        this._id = _id;
        this.username = username;
        this.email = email;
        this.token = token;
        this.totalStars = totalStars;
        this.totalPoints = totalPoints;
        this.password = password;
        this.passwordConfirmation = passwordConfirmation;
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map