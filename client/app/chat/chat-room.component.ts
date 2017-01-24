/**
 * Created by magalhaes on 24/01/2017.
 */
import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {WebSocketService} from "../services/websocket.service";
import {AuthService} from "../services/auth.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: 'chat-room',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css']
})
export class ChatRoomComponent implements OnInit{
    chatForm: FormGroup;

    private type = "Room";
    private roomId: string;

    protected chatMessages: string[] = [];

    constructor(private formBuilder: FormBuilder, public webSocket: WebSocketService, public auth: AuthService, private route: ActivatedRoute) {
        this.chatForm = this.formBuilder.group({
            'message': [null, Validators.minLength(1)]
        });

    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.roomId = params['room'];
        })
        this.webSocket.getChatMessagesFromRoom(this.roomId).subscribe((m:any) => this.chatMessages.push(<string>m));
    }

    sendMessage() {
        let now = new Date(Date.now());
        let time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();


        let message = this.auth.getCurrentUser().username + ' (' + time + '): ' + this.chatForm.controls['message'].value
        this.webSocket.sendChatMessageToRoom(this.roomId, message);
        this.chatForm.controls['message'].setValue("");
    }
}
