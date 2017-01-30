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
        this.images = [];
        this.arrAux = [];
        this.chatForm = this.formBuilder.group({
            'message': [null, forms_1.Validators.minLength(1)]
        });
    }
    ChatLobbyComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.webSocket.getChatMessages().subscribe(function (m) {
            _this.images.push(m.image);
            _this.chatMessages.push({
                chat: m.username,
                date: m.date
            });
            _this.arrAux = _this.transform(_this.images, _this.chatMessages);
        });
    };
    ChatLobbyComponent.prototype.sendMessage = function () {
        if (this.chatForm.controls['message'].value !== null) {
            var now = new Date(Date.now());
            var hour = now.getHours().toString();
            var minute = now.getMinutes().toString();
            if (now.getHours() < 10) {
                hour = "0" + now.getHours();
            }
            if (now.getMinutes() < 10) {
                minute = "0" + now.getMinutes();
            }
            var time = hour + ":" + minute;
            var message = { image: this.auth.getCurrentUser().profilePic, username: this.auth.getCurrentUser().username, date: ' (' + time + '): ' + this.chatForm.controls['message'].value };
            this.webSocket.sendChatMessage(message);
            this.chatForm.controls['message'].setValue("");
        }
    };
    ChatLobbyComponent.prototype.transform = function (arr1, arr2) {
        var arr = [];
        arr1.forEach(function (m, i) {
            arr.push({ image: m, message: arr2[i] });
        });
        return arr;
    };
    return ChatLobbyComponent;
}());
ChatLobbyComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'chat-lobby',
        templateUrl: 'chat.component.html',
        styleUrls: ['chat.component.css']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder, websocket_service_1.WebSocketService, auth_service_1.AuthService])
], ChatLobbyComponent);
exports.ChatLobbyComponent = ChatLobbyComponent;
//# sourceMappingURL=chat-lobby.component.js.map