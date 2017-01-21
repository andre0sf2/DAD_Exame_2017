import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { GameService } from '../services/game.service'; 

import { User } from '../model/user';
import { Game } from '../model/game';

@Component({
    moduleId:module.id,
    selector:'lobby',
    templateUrl:'lobby.component.html'
})

export class LobbyComponent implements OnInit{



    myGames: Game[] = [];
    otherGames: Game[] = [];

    already_join: boolean = false;


    info: string = "";

    constructor(private authService: AuthService, private gameService : GameService, private router: Router){};

    ngOnInit(){
        this.findMyGames();
        this.findOtherGames();

        /*this.websocketService.getNewRoom().subscribe((m: any) => {
            this.findOtherGames();
            this.findMyGames();
        });

        this.websocketService.getJoinOnRoom().subscribe((m: any) => {
            console.log("Join Player: " + m);
            this.findMyGames();
            this.findOtherGames();
        });

        this.websocketService.getGameStart().subscribe((m: any) => {
            console.log("Jogo vai começar: " + m);
            this.router.navigateByUrl('/table-game/' + m);
        });

        this.websocketService.getRoomDeleted().subscribe((m: any) => {
            console.log("Apaguei jogo");
            this.findOtherGames();
            this.findMyGames();
        });*/

    }

    findMyGames(){
        //console.log(JSON.parse(localStorage.getItem('user'));
        this.gameService.findMyGames(JSON.parse(localStorage.getItem('user'))).subscribe(games=>{
            this.myGames = games;
        })
        //console.log(this.myGames);
    }

    findOtherGames(){
        this.gameService.findOtherGames(JSON.parse(localStorage.getItem('user'))).subscribe(games=>{
            this.otherGames = games;
        })
    }

    createGame(){
        this.gameService.createGame(JSON.parse(localStorage.getItem('user'))).subscribe((resource: any) => 
        {
            if(resource!== 'No game data'){
                this.info="Game created";
 //               this.websocketService.newRoom({room:'Room' + /*roomName+*/ resource._id, userId: })
                this.findMyGames();  
            }else{
                this.info="Error creating game";
            }

        })
    }

    deleteGame(i: number): void{
        this.gameService.deleteGame(this.myGames[i], this.authService.getCurrentUser()).subscribe(resource =>
            console.log(resource + 'hhh')
        );
        this.findMyGames();
        this.router.navigateByUrl(this.router.url);
    }

    joinGame(i:number):void{
        //verify length and status
        if(this.otherGames[i].nplayers == 4 || this.otherGames[i].status != "on lobby"){
            console.log('game is full');
            return;
        }
        this.already_join = false;
        this.otherGames[i].players.forEach((player:any) => {
            if(player.player == this.authService.getCurrentUser()._id){
                console.log('already join');
                this.already_join = true;
            }    
        });

        if(!this.already_join){

            this.otherGames[i].players.push({player:this.authService.getCurrentUser()._id, score:0});
            this.otherGames[i].nplayers = this.otherGames[i].nplayers + 1;

            this.gameService.updateGame(this.otherGames[i], this.authService.getCurrentUser()).subscribe(response => {
                /*console.log(response)*/
                if(response.nplayers == 4){
                    console.log('game will start');
                    
                    response.status = 'on play';
                    this.gameService.updateGame(response, this.authService.getCurrentUser()).subscribe(res => console.log('1'+ res));
                } 
            });
            
        }
    }

    startGame(i: number){
        let room: string = 'room' + this.myGames[i]._id;
        //notifyAll
        this.myGames[i].status = 'playing';
        this.gameService.updateGame(this.myGames[i], this.authService.getCurrentUser()).subscribe(r => console.log(r));
        this.router.navigateByUrl('/table-game/' + Date.now());
        //this.websocketService.notifyAllPlayerGameStarted({ message: 'Game Start!', room: room });
    }
}