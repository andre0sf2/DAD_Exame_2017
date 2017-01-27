/**
 * Created by magalhaes on 23/01/2017.
 */
import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {WebSocketService} from "../services/websocket.service";
import {AuthService} from "../services/auth.service";
import {DateFormatter} from "@angular/common/src/facade/intl";

@Component({
    moduleId: module.id,
    selector: 'chat-lobby',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css']
})
export class ChatLobbyComponent implements OnInit{
    chatForm: FormGroup;

    private type = "Lobby";

    protected chatMessages: string[] = [];

    protected images:string[] = [];

    arrAux:any[] = [];

    constructor(private formBuilder: FormBuilder, public webSocket: WebSocketService, public auth: AuthService) {
        this.chatForm = this.formBuilder.group({
            'message': [null, Validators.minLength(1)]
        });

    }

    ngOnInit() {
        this.webSocket.getChatMessages().subscribe((m:any) => {
            this.images.push(<string>m.image);
            this.chatMessages.push(<string>m.username);
            this.arrAux = this.transform(this.images, this.chatMessages);
        });
    }

    sendMessage() {
        if (this.chatForm.controls['message'].value !== null) {
            let now = new Date(Date.now());
            let time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();


            let message = {image: this.auth.getCurrentUser().profilePic, username: this.auth.getCurrentUser().username + ' (' + time + '): ' + this.chatForm.controls['message'].value};
            this.webSocket.sendChatMessage(message);
            this.chatForm.controls['message'].setValue("");
        }
    }

    transform(arr1:any[], arr2:any[]) {
        let arr:any = [];
        arr1.forEach((m, i) => {
            arr.push({ image: m, message: arr2[i] });
        });

        return arr;
    }
}
