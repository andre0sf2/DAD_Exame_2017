/**
 * Created by magalhaes on 23/01/2017.
 */
import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {WebSocketService} from "../services/websocket.service";
import {AuthService} from "../services/auth.service";

@Component({
    moduleId: module.id,
    selector: 'chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css']
})
export class ChatComponent implements OnInit{
    private chatForm: FormGroup;

    protected chatMessages: string[] = [];

    constructor(private formBuilder: FormBuilder, private webSocket: WebSocketService, private auth: AuthService) {
        this.chatForm = this.formBuilder.group({
            'message': [null, Validators.minLength(1)]
        });

    }

    ngOnInit() {
        this.webSocket.getChatMessages().subscribe((m:any) => this.chatMessages.push(<string>m));
    }

    sendMessage() {
        this.webSocket.sendChatMessage(this.auth.getCurrentUser().username + ': ' + this.chatForm.controls['message'].value);
        this.chatForm.controls['message'].setValue("");
    }


}
