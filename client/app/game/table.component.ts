import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { WebSocketService } from '../services/websocket.service';


import { Card } from '../model/card';
import { Mesa } from '../model/mesa';
import { GameService } from "../services/game.service";
import { Game } from "../model/game";
import { sanitizeSrcset } from "@angular/platform-browser/src/security/url_sanitizer";

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

    public jogadores: string[] = [];
    chatChannel: string[] = [];
    public isMyTurn: boolean = false;
    public currentRound: number = 0;

    public suitImg: string = "";
    public suitName: string = "";
    public user: string = this.auth.getCurrentUser().username;

    public cartasJogadas:any [] = [];

    constructor(private router: Router, private auth: AuthService, private websocketService: WebSocketService,
        private activeRoute: ActivatedRoute) {
        this.getSuit();
    }

    gotoLobby() {
        this.router.navigateByUrl('');
    }

    ngOnInit() {

        this.cards = [];
        this.baralhoJogadores = [];
        this.jogadores = [];

        this.activeRoute.params.subscribe(params => {
            this.room = params['room'];
        });

        this.getGamePlayers();
        this.getMyCards();
        this.addCard();

        this.websocketService.getCard(this.auth.getCurrentUser().username).subscribe((m: any) => {
            console.log(m);
        });
        this.getTurn();
        this.getMoves();
        this.getRoundWinners();
        this.getSuit();
        /*this.websocketService.getChatMessagesOnRoom().subscribe((m: any) => this.chatChannel.push(<string>m));



        console.log(this.room);
/*        this.route.params
            .switchMap((params: Params) => this.gameService.getGame(params['room']))
            .subscribe((game: Game) => this.game = game);*/

        this.mesa = new Mesa();
        this.cards = this.mesa.cards;
        this.baralharCartas(this.cards);
    }

    getMyCards() {
        this.websocketService.getMyCards().subscribe((m: any) => {
            //console.log("MINHAS CARTAS: v2" + m.card);
            let c = new Card(m.card._tipoCard, m.card._simbolo, m.card._ponto, m.card._img);
            this.baralhoJogadores.push(c);
            this.baralhoJogadores.sort();
        });

    }

    getTurn() {
        this.websocketService.getTurn().subscribe((m: any) => {
            //console.log(m);
            if (m.username == this.auth.getCurrentUser().username) {
                console.log("ITS YOUR TURN");
                this.isMyTurn = true;
                this.currentRound = m.round;
            }
        });
    }

    addCard() {

        this.websocketService.getCard({ username: this.auth.getCurrentUser().username }).subscribe((m: any) => {
            //console.log("Carta: "+m.card._tipoCard+m.card._simbolo+"\n"+"User: "+ m.username);

        });

    }

    getRoundWinners(){
        this.websocketService.getRoundWinners().subscribe((m:any)=>{
            console.log("WINNER OF ROUND");
            console.log(m);
        })
    }
    getGamePlayers() {
        this.websocketService.getGamePlayers(this.room).subscribe((m: any) => {
            this.jogadores.push(<string>m);
            console.log(this.jogadores);
        });
    }

    getSuit() {
        console.log("get trunfo");
        this.websocketService.getSuit({ room: this.room }).subscribe((m: any) => {
            //console.log("Trunfo é: " + m._tipoCard);
            this.suitImg = m._img;

            switch (m._tipoCard) {
                case "o": this.suitName = "Ouros";
                    break;
                case "p": this.suitName = "Paus";
                    break;
                case "e": this.suitName = "Espadas";
                    break;
                case "c": this.suitName = "Copas";
                    break;
            }
        });
    }

    getMoves() {
        this.websocketService.getMoves().subscribe((m: any) => {
            console.log(m);
        });
    }

    cleanMesa() {
        this.mesa = new Mesa();
        this.error = '';
    }

    getCardBaralho(card: Card) {
        if (this.isMyTurn) {
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].tipoCard == card.tipoCard && this.cards[i].simbolo == card.simbolo) {
                    //console.log(this.cards[i].toString());
                    this.websocketService.sendCard({ room: this.room, round: this.currentRound,  username: this.auth.getCurrentUser().username, card: this.cards[i] });
                    this.removeCard(this.cards[i]);
                }
            }
            this.isMyTurn = false;
        }else{
            console.log("WARNING - wait for your turn");
        }
    }

    countCards(): number {
        let count: number = 0;
        for (let i = 0; i < this.mesa.cards.length; i++) {
            count += this.mesa.cards[i].ponto;
        }
        //console.log(count);
        return count;
    }

    checkCheating() {

    }

    removeCard(card: Card) {
        for (let i = 0; i < this.baralhoJogadores.length; i++) {
            if (this.baralhoJogadores[i].tipoCard == card.tipoCard && this.baralhoJogadores[i].simbolo == card.simbolo) {
                this.baralhoJogadores.splice(i, 1);
            }
        }
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
