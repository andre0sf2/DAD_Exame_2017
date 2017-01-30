import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {User} from "../model/user";
import {ResizeOptions, ImageResult} from "ng2-imageupload";



@Component({
    moduleId: module.id,
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css']
})
export class ProfileComponent{

    edit: boolean = false;

    constructor(private auth: AuthService) {
        this.edit = false;
        console.log(this.user.profilePic);
    }

    public user = this.auth.getCurrentUser();

    public src = "";

    editPic(userAux: User){
        console.log("Imagem: "+ userAux.profilePic);
        this.user = userAux;
        this.auth.update(userAux);
        this.edit = false;
    }

    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 178,
        resizeMaxWidth: 178
    };

    selected(imageResult: ImageResult) {
        this.src = imageResult.resized && imageResult.resized.dataURL || imageResult.dataURL;
        this.user.profilePic = this.src;
        //console.log("Imagem: "+ this.src);
        this.editPic(this.user);
    }



}