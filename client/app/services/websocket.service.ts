import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

@Injectable()
export class WebSocketService {
    private socket: SocketIOClient.Socket;
    constructor() {
        if (!this.socket) {
            this.socket = io(`http://${window.location.hostname}:7777`);
        }
    }

    sendChatMessage(message: any) {
        this.socket.emit('chat', message);
    }

    getPlayersMessages(): Observable<any> {
        return this.listenOnChannel('players');
    }

    getChatMessages(): Observable<any> {
        return this.listenOnChannel('chat');
    }
    getNotes(): Observable<any> {
       // console.log("entrei auqi ");
        return this.listenOnChannel('notes');
    }

    sendChatMessageOnRoom(message: any) {
        this.socket.emit('roomChat', message);
    }

    sendNote(message: any) {
        this.socket.emit('notes', message);
    }

    getChatMessagesOnRoom(): Observable<any> {
        return this.listenOnChannel('roomChat');
    }

     getDerrotado(): Observable<any> {
        return this.listenOnChannel('derrotado');
    }



    sendClickElementMessage(index: number) {
        this.socket.emit('clickElement', index);
    }

    getBoardMessages(): Observable<any> {
        return this.listenOnChannel('board');
    }

    newRoom(message: any) {
        this.socket.emit('room', message); //room15651456146514
    }

    getNewRoom(): Observable<any> {
        return this.listenOnChannel('room');
    }



    roomDeleted(message: any) {
        this.socket.emit('roomDeleted', message); //room15651456146514
    }

    getRoomDeleted(): Observable<any> {
        return this.listenOnChannel('roomDeleted');
    }

    joinRoom(message: any) {
        this.socket.emit('join', message);
    }

    getJoinOnRoom(): Observable<any> {
        return this.listenOnChannel('join');
    }

    notifyAllPlayerGameStarted(message: any) {
        this.socket.emit('game_start', message);
    }



    getGameStart(): Observable<any> {
        return this.listenOnChannel('game_start');
    }

    notifyAllPlayersImReady(message: any) {
        this.socket.emit('ready', message);
    }

    getPlayersReady(): Observable<any> {
        return this.listenOnChannel('ready');
    }

    getAllPlayersReady(): Observable<any> {
        return this.listenOnChannel('all_ready');
    }

    sendGetTurn(message: any) {
        this.socket.emit('yourTurn', message);
    }

    getTurn(): Observable<any> {
        return this.listenOnChannel('yourTurn');
    }

    sendCard(message: any){
        this.socket.emit('card', message);
    }

    getCard(): Observable<any> {
        return this.listenOnChannel('card');
    }

    private listenOnChannel(channel: string): Observable<any> {
        return new Observable((observer: any) => {
            this.socket.on(channel, (data: any) => {
                observer.next(data);
            });
            return () => this.socket.disconnect();
        });
    }

}
