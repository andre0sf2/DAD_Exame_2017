import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { WebSocketService } from '../services/websocket.service';


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
export class TableComponent implements OnInit {
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

    constructor(private route: Router, private auth: AuthService, private websocketService: WebSocketService,
            private activeRoute: ActivatedRoute) { }

    ngOnInit() {

        this.cards = [];

        this.activeRoute.params.subscribe(params => {
            this.room = params['room'];
        });
        this.websocketService.getGamePlayers(this.room).subscribe((m: any) => console.log(m));


        this.getCards();
        /*this.websocketService.getChatMessagesOnRoom().subscribe((m: any) => this.chatChannel.push(<string>m));



        console.log(this.room);
/*        this.route.params
            .switchMap((params: Params) => this.gameService.getGame(params['room']))
            .subscribe((game: Game) => this.game = game);*/


        this.cards = [];

        this.mesa = new Mesa();
        this.cards = this.mesa.cards;
        this.baralharCartas(this.cards);
    }

    getCards(){
        console.log("tenho uma carta");
        this.websocketService.getMyCards({ username: this.auth.getCurrentUser().username }).subscribe((m: any) => console.log(m));

    }


    addCard() {
        this.mesa.getCard("o", 2);
    }

    cleanMesa() {
        this.mesa = new Mesa();
        this.error = '';
    }

    getCardBaralho(card: Card){

        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].tipoCard == card.tipoCard && this.cards[i].simbolo == card.simbolo) {
                console.log(this.cards[i]);
                return this.cards[i];
            }
        }

        return;
    }

    countCards(): number {
        let count: number = 0;
        for (let i = 0; i < this.mesa.cards.length; i++) {
            count += this.mesa.cards[i].ponto;
        }
        console.log(count);
        return count;
    }

    checkCheating() {

    }

    baralharCartas(cards: Card[]) {
        let j: number, k: Card;
        for (let i = cards.length; i; i--) {
            j = Math.floor(Math.random() * i);
            k = cards[i - 1];
            cards[i - 1] = cards[j];
            cards[j] = k;

        }
    }
}
