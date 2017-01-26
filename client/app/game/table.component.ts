import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { WebSocketService } from '../services/websocket.service';


import { Card } from '../model/card';
import { Mesa } from '../model/mesa';
import {GameService} from "../services/game.service";
import {Game} from "../model/game";
import {sanitizeSrcset} from "@angular/platform-browser/src/security/url_sanitizer";

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

    public suitImg: string = "";
    public suitName: string = "";
    public user: string = this.auth.getCurrentUser().username;

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

        this.websocketService.getCard(this.auth.getCurrentUser().username).subscribe((m:any) => {
            console.log(m);
        });

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

    getMyCards(){
        this.websocketService.getMyCards().subscribe((m: any) => {
            //console.log("MINHAS CARTAS: v2" + m.card);
            let c = new Card(m.card._tipoCard, m.card._simbolo, m.card._ponto, m.card._img);
            this.baralhoJogadores.push(c);
            this.baralhoJogadores.sort();
        });

    }

    addCard() {
        this.websocketService.getCard({username: this.auth.getCurrentUser().username}).subscribe((m: any) => {
            //console.log("Carta: "+m.card._tipoCard+m.card._simbolo+"\n"+"User: "+ m.username);


            if(this.user == m.username){
                //this.cartaJogada = m.card._img;
                let img = document.getElementById(m.username);
                img.setAttribute("src", m.card._img)
                console.log(img);
            }



        });

    }
    getGamePlayers(){
        this.websocketService.getGamePlayers(this.room).subscribe((m: any) => {
            this.jogadores.push(<string>m);
            console.log(this.jogadores);
        });
    }

    getSuit(){
        console.log("get trunfo");
        this.websocketService.getSuit({room: this.room}).subscribe((m:any) => {
            //console.log("Trunfo é: " + m._tipoCard);
            this.suitImg = m._img;

            switch (m._tipoCard){
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

    cleanMesa() {
        this.mesa = new Mesa();
        this.error = '';
    }

    getCardBaralho(card: Card){Card

        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].tipoCard == card.tipoCard && this.cards[i].simbolo == card.simbolo) {
                //console.log(this.cards[i].toString());
                this.websocketService.sendCard({username: this.auth.getCurrentUser().username, card: this.cards[i]});
                this.removeCard(this.cards[i]);
            }
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

    removeCard(card: Card){
        for (let i = 0; i < this.baralhoJogadores.length; i++) {
            if (this.baralhoJogadores[i].tipoCard == card.tipoCard && this.baralhoJogadores[i].simbolo == card.simbolo){
                this.baralhoJogadores.splice(i,1);
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
