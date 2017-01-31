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
    public jogPics: any[] = [];
    chatChannel: string[] = [];
    public isMyTurn: boolean = false;
    public currentRound: number = 0;

    public suitImg: string = "";
    public suitName: string = "";
    public user: string = this.auth.getCurrentUser().username;

    public cartasJogadas: any[] = [];

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

        this.websocketService.getCard(this.auth.getCurrentUser().username).subscribe((m: any) => {
            console.log(m);
        });
        this.getTurn();
        this.getMoves();
        this.getRoundWinners();
        this.getSuit();
        this.getFinal();
        this.checkCheating();
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
            this.jogadores.forEach(jogador => {
                if(m.username != jogador){
                    let sty = document.getElementById(jogador+"sep");
                    sty.style.color = "black";
                }
            })
            let sty = document.getElementById(m.username+"sep");
            sty.style.color = "yellow";

        });
    }

    getFinal(){
        this.websocketService.getFinal().subscribe((m:any) => {
            console.log("GAME OVER - WINNERS");
            console.log(m);
            alert("GAME OVER - WINNERS: " + m.winner1 +"and\t "+ m.winner2);
        })
    }


    getRoundWinners() {
        this.websocketService.getRoundWinners().subscribe((m: any) => {
            console.log("WINNER OF ROUND");
            console.log(m);
            setTimeout(this.cleanMesa(), 1000);
        })
    }
    getGamePlayers() {
        this.websocketService.getGamePlayers(this.room).subscribe((m: any) => {
            this.jogadores.push(<string>m.username);
            this.jogPics.push(<string>m.img);
            //console.log(m);
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
            //console.log(m);
            let img = document.getElementById(m.username);
            img.setAttribute("src", m.card._img);
        });
    }

    cleanMesa() {
        this.jogadores.forEach(jogador => {
            let img = document.getElementById(jogador);
            img.setAttribute("src", "../../img/cards/semFace.png");
        })
    }

    getCardBaralho(card: Card) {
        if (this.isMyTurn) {
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].tipoCard == card.tipoCard && this.cards[i].simbolo == card.simbolo) {
                    //console.log(this.cards[i].toString());
                    this.websocketService.sendCard({ room: this.room, round: this.currentRound, username: this.auth.getCurrentUser().username, card: this.cards[i] });
                    this.removeCard(this.cards[i]);
                }
            }
            this.isMyTurn = false;
        } else {
            console.log("WARNING - wait for your turn");
        }
    }

    checkCheating() {
       this.websocketService.getRenunciaFeedBack().subscribe(m => {
           console.log(m);
           this.cleanMesa();
       })
    }

    renuncia(playerVerificar:string, playerDenuncia: string){

        if(this.user != playerVerificar) {
            //console.log(playerVerificar, playerDenuncia);
            this.websocketService.sendRenuncia({
                verificar: playerVerificar, denuncia: playerDenuncia, room:this.room
            });
        }
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
