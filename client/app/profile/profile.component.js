"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var auth_service_1 = require("../services/auth.service");
var ProfileComponent = (function () {
    function ProfileComponent(auth) {
        this.auth = auth;
        this.edit = false;
        this.user = this.auth.getCurrentUser();
        this.src = "";
        this.resizeOptions = {
            resizeMaxHeight: 178,
            resizeMaxWidth: 178
        };
        this.edit = false;
        console.log(this.user.profilePic);
    }
    ProfileComponent.prototype.editPic = function (userAux) {
        console.log("Imagem: " + userAux.profilePic);
        this.user = userAux;
        this.auth.update(userAux);
        this.edit = false;
    };
    ProfileComponent.prototype.selected = function (imageResult) {
        this.src = imageResult.resized && imageResult.resized.dataURL || imageResult.dataURL;
        this.user.profilePic = this.src;
        //console.log("Imagem: "+ this.src);
        this.editPic(this.user);
    };
    return ProfileComponent;
}());
ProfileComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'profile.component.html',
        styleUrls: ['profile.component.css']
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], ProfileComponent);
exports.ProfileComponent = ProfileComponent;
//# sourceMappingURL=profile.component.js.map