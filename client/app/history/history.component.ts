import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GameService } from '../services/game.service';
import { Game } from '../model/game'; 

@Component({
    moduleId: module.id,
    selector: 'history',
    templateUrl: 'history.component.html',
})

export class HistoryComponent implements OnInit{

    allGames : Game[] = [];

    constructor(private gameService: GameService){}

    ngOnInit(){
        this.getAllGames();
    }

    getAllGames() : void{
        this.gameService.getAllGames().subscribe(games => console.log(this.allGames = games));
    }

}
