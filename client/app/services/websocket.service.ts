import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

@Injectable()
export class WebSocketService {

    private socket: SocketIOClient.Socket;

    constructor() {
        if (!this.socket) {
            this.socket = io(`http://138.68.100.185:7777`);
        }
    }

    getTurn(): Observable<any> {
        return this.listenOnChannel('turn');
    }

    getRoundWinners(): Observable<any>{
        return this.listenOnChannel('round');
    }

    sendRenuncia(message: any){
        this.socket.emit('renuncia', message);
    }

    getRenunciaFeedBack(): Observable<any>{
        return this.listenOnChannel('renuncia-feedback')
    }

    getFinal():Observable<any>{
        return this.listenOnChannel('final');
    }

    getMoves() {
        return this.listenOnChannel('move');
    }


    getMyCards(): Observable<any> {
        return this.listenOnChannel('my-cards');
    }

    getGamePlayers(roomID: string) {
        //this.socket.emit('players-on-game', {room: roomID});
        return this.listenOnChannel('players-on-game');
    }

    getSuit(room: any) {
        //       this.socket.emit('suit', room);
        return this.listenOnChannel('suit');
    }

    sendStartGame(message: any) {
        this.socket.emit('start-game', message);
        console.log("sendStartGame");
    }

    sendChatMessage(message: any) {
        this.socket.emit('lobby-chat', message);
    }

    getPlayersMessages(): Observable<any> {
        return this.listenOnChannel('players');
    }

    getChatMessages(): Observable<any> {
        return this.listenOnChannel('lobby-chat');
    }
    getNotes(): Observable<any> {
        // console.log("entrei auqi ");
        return this.listenOnChannel('notes');
    }

    sendChatMessageToRoom(room: string, message: any) {
        this.socket.emit('room-chat', message);
    }

    getChatMessagesFromRoom(room: string): Observable<any> {
        return this.listenOnChannel('room-chat');
    }

    sendNote(message: any) {
        this.socket.emit('notes', message);
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

    createRoom(message: any) {
        this.socket.emit('room', message);
        console.log("room created");
    }

    getCreateRoom(): Observable<any> {
        return this.listenOnChannel('room');
    }

    roomDeleted(message: any) {
        this.socket.emit('roomDeleted', message);
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
        this.socket.emit('game-start', message);
    }



    getGameStart(): Observable<any> {
        return this.listenOnChannel('game-start');
    }


    sendCard(message: any) {
        //console.log(message);
        this.socket.emit('card', message);
    }

    getCard(message: any): Observable<any> {
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
