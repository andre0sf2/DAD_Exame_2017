/**
 * Created by magalhaes on 23/01/2017.
 */
import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {WebSocketService} from "../services/websocket.service";
import {AuthService} from "../services/auth.service";

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

    constructor(private formBuilder: FormBuilder, public webSocket: WebSocketService, public auth: AuthService) {
        this.chatForm = this.formBuilder.group({
            'message': [null, Validators.minLength(1)]
        });

    }

    ngOnInit() {
        this.webSocket.getChatMessages().subscribe((m:any) => this.chatMessages.push(<string>m));
    }

    sendMessage() {
        let message = this.auth.getCurrentUser().username + '(' + Date.now() + '): ' + this.chatForm.controls['message'].value
        this.webSocket.sendChatMessage(message);
        this.chatForm.controls['message'].setValue("");
    }
}
