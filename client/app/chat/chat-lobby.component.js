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
/**
 * Created by magalhaes on 23/01/2017.
 */
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var websocket_service_1 = require("../services/websocket.service");
var auth_service_1 = require("../services/auth.service");
var ChatLobbyComponent = (function () {
    function ChatLobbyComponent(formBuilder, webSocket, auth) {
        this.formBuilder = formBuilder;
        this.webSocket = webSocket;
        this.auth = auth;
        this.type = "Lobby";
        this.chatMessages = [];
        this.chatForm = this.formBuilder.group({
            'message': [null, forms_1.Validators.minLength(1)]
        });
    }
    ChatLobbyComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.webSocket.getChatMessages().subscribe(function (m) { return _this.chatMessages.push(m); });
    };
    ChatLobbyComponent.prototype.sendMessage = function () {
        if (this.chatForm.controls['message'].value !== null) {
            var now = new Date(Date.now());
            var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
            var message = this.auth.getCurrentUser().username + ' (' + time + '): ' + this.chatForm.controls['message'].value;
            this.webSocket.sendChatMessage(message);
            this.chatForm.controls['message'].setValue("");
        }
    };
    ChatLobbyComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'chat-lobby',
            templateUrl: 'chat.component.html',
            styleUrls: ['chat.component.css']
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder, websocket_service_1.WebSocketService, auth_service_1.AuthService])
    ], ChatLobbyComponent);
    return ChatLobbyComponent;
}());
exports.ChatLobbyComponent = ChatLobbyComponent;
//# sourceMappingURL=chat-lobby.component.js.map