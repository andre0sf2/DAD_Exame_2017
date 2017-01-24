import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import { AuthService } from '../services/auth.service';

import { Card } from './card';
import { Mesa } from './mesa';
import {GameService} from "../services/game.service";
import {Game} from "../model/game";

@Component({
    moduleId: module.id,
    selector: 'game',
    templateUrl: 'table.component.html',
    styleUrls: ['table.component.css']
})
export class TableComponent implements OnInit{
    public error: string = '';
    public cards: Card[] = [];
    public baralhoJogadores: Card[] = [];

    public mesa: Mesa;

    private room: string;

    public adversarios: string[] = [];
    public temAdversario: boolean = false;
    chatChannel: string[] = [];
    public allReady: boolean = false;
    public isMyTurn: boolean = false;

    constructor(private route: ActivatedRoute, private gameService: GameService) { }

    ngOnInit() {

        this.route.params.subscribe(params => {
            this.room = params['room'];
        });

        console.log(this.room);
/*        this.route.params
            .switchMap((params: Params) => this.gameService.getGame(params['room']))
            .subscribe((game: Game) => this.game = game);*/


        this.cards = [];

        this.mesa = new Mesa();
        this.cards = this.mesa.cards;
        this.baralharCartas(this.cards);
    }

    addCard(){
        this.mesa.getCard("o", 2);
    }

    cleanMesa(){
        this.mesa = new Mesa();
        this.error = '';
    }

    countCards(): number{
        let count: number = 0;
        for(let i = 0; i < this.mesa.cards.length; i++){
            count += this.mesa.cards[i].ponto;
        }
        console.log(count);
        return count;
    }

    checkCheating() {

    }

    baralharCartas(cards: Card[])
    {
        let j:number, k:Card;
        for(let i = cards.length; i; i--)
        {
            j = Math.floor(Math.random() * i);
            k = cards[i-1];
            cards[i-1] = cards[j];
            cards[j] = k;

        }
        console.log(this.cards);
    }
}