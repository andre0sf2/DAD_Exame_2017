import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { GameService } from '../services/game.service';
import { WebSocketService } from '../services/websocket.service';

import { User } from '../model/user';
import { Game } from '../model/game';

@Component({
    moduleId: module.id,
    selector: 'lobby',
    templateUrl: 'lobby.component.html'
})

export class LobbyComponent implements OnInit {

    myGames: Game[] = [];
    otherGames: Game[] = [];
    ongoingGames: Game[] = [];

    already_join: boolean = false;

    info: string = "";

    constructor(private authService: AuthService, private gameService: GameService, private router: Router,
        private webSocketService: WebSocketService) { };

    ngOnInit() {
        this.findMyGames();
        this.findOtherGames();
        this.findPlayingGames();

        this.webSocketService.getCreateRoom().subscribe((m: any) => {
            console.log("ROOOM CREATEDEE");
            this.findOtherGames();
            this.findMyGames();
        });

        this.webSocketService.getJoinOnRoom().subscribe((m: any) => {
            console.log("Join Player: " + m);
            this.findMyGames();
            this.findOtherGames();
        });

        this.webSocketService.getGameStart().subscribe((m: any) => {
            console.log("Jogo vai começar: " + m);
            console.log("SADSAD");
            this.router.navigateByUrl('/game/' + m);
        });

        this.webSocketService.getRoomDeleted().subscribe((m: any) => {
            console.log("Apaguei jogo");
            this.findOtherGames();
            this.findMyGames();
        });

    }

    findMyGames() {
        //console.log(JSON.parse(localStorage.getItem('user'));
        this.gameService.findMyGames(JSON.parse(localStorage.getItem('user'))).subscribe(games => {
            this.myGames = games;
        })
    }

    findPlayingGames() {
        //console.log(JSON.parse(localStorage.getItem('user'));
        this.gameService.findPlayingGames(this.authService.getCurrentUser()).subscribe(games => {
            this.ongoingGames = games;
        })
    }

    findOtherGames() {
        this.gameService.findOtherGames(JSON.parse(localStorage.getItem('user'))).subscribe(games => {
            this.otherGames = games;
        })
    }

    createGame() {
        this.gameService.createGame(JSON.parse(localStorage.getItem('user'))).subscribe((resource: any) => {
            if (resource !== 'No game data') {
                this.info = "Game created";
                this.webSocketService.createRoom({
                    room: 'room' + resource._id,
                    userId: this.authService.getCurrentUser()._id, username: this.authService.getCurrentUser().username
                });
                this.findMyGames();
            } else {
                this.info = "Error creating game";
            }

        })
    }

    deleteGame(i: number): void {
        this.gameService.deleteGame(this.myGames[i], this.authService.getCurrentUser()).subscribe(resource =>
            console.log(resource + 'hhh')
        );
        this.findMyGames();
        this.router.navigateByUrl(this.router.url);
    }

    joinGame(i: number): void {
        //verify length and status
        if (this.otherGames[i].nplayers == 4 || this.otherGames[i].status != "on lobby") {
            console.log('game is full');
            return;
        }
        this.already_join = false;
        this.otherGames[i].players.forEach((player: any) => {
            if (player.player == this.authService.getCurrentUser()._id) {
                console.log('already join');
                this.already_join = true;
            }
        });

        if (!this.already_join) {

            this.webSocketService.joinRoom({ userId: this.authService.getCurrentUser()._id, username: this.authService.getCurrentUser().username, room: 'room' + this.otherGames[i]._id });


            this.otherGames[i].players.push({ player: this.authService.getCurrentUser()._id, points: 0 });
            this.otherGames[i].nplayers = this.otherGames[i].nplayers + 1;

            this.gameService.updateGame(this.otherGames[i], this.authService.getCurrentUser()).subscribe(response => {
                /*console.log(response)*/
                if (response.nplayers == 4) {
                    console.log('game will start');

                    response.status = 'on going';
                    let currentdate = new Date();
                    let datetime = currentdate.getDate() + "-"
                        + (currentdate.getMonth() + 1) + "-"
                        + currentdate.getFullYear() + " "
                        + currentdate.getHours() + ":"
                        + currentdate.getMinutes() + ":"
                        + currentdate.getSeconds();

                    response.dateStart = datetime;
                    this.gameService.updateGame(response, this.authService.getCurrentUser()).subscribe(res => console.log('1' + res));

                    this.webSocketService.sendStartGame({
                        room: 'room' + this.otherGames[i]._id,
                        userId: this.authService.getCurrentUser()._id, username: this.authService.getCurrentUser()._username
                    });
                    console.log("pedido efectuado");
                }
            });

        }
    }

    openGame(i: number): void {
        this.router.navigateByUrl('/game/room' + this.ongoingGames[i]._id);
    }

}