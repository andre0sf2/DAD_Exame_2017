import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { Card } from './card';
import { Mesa } from './mesa';

@Component({
    moduleId: module.id,
    selector: 'table-game',
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

    constructor(private websocketService: WebSocketService, private route: ActivatedRoute, private auth: AuthService) { }

    ngOnInit() {

        this.cards = [];

        this.websocketService.getChatMessagesOnRoom().subscribe((m: any) => this.chatChannel.push(<string>m));

        this.route.params.subscribe(params => {
            this.room = params['room'];
        });

        this.websocketService.getAllPlayersReady().subscribe((r: any) => {
            console.log(r);
            this.allReady = true;
        });

        this.websocketService.getTurn().subscribe((r: string) => {
            //r = username
            if (r === this.auth.getCurrentUser().username) {
                this.error = 'My turn!';
                this.isMyTurn = true;
            } else {
                this.isMyTurn = false;
                this.error = 'Player turn!: ' + r;
            }
        });

        this.websocketService.getDerrotado().subscribe((r: any) => {
            if (this.auth.getCurrentUser().username == r.usernameAlvo) {
                console.log("Derrotado");
                this.error = 'Fui derrotado';
            }
        });

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