const io = require('socket.io');

const mongodb = require('mongodb');
const util = require('util');
import { HandlerSettings } from './handler.settings';
import { databaseConnection as database } from './app.database';

export class WebSocketServer {
    public io: any;

    public games: Mesa[] = [];

    public init = (server: any) => {

        this.io = io.listen(server);
        this.io.sockets.on('connection', (client: any) => {

            client.player = new Player();

            client.emit('players', Date.now() + ': Welcome to Sueca Online');

            client.broadcast.emit('players', Date.now() + ': A new player has arrived');

            client.on('lobby-chat', (data: any) => this.io.emit('lobby-chat', {
                image: data.image, username: data.username
            }));
            client.on('room-chat', (data: any) => {
                this.io.to(client.player.gameRoom).emit('room-chat', {
                    image: data.image, username: data.username
                })
            });



            client.on('room', (data: any) => {
                console.log("One room was created" + data.room);
                client.join(data.room); // o utilizador junta-se ao room que criou

                client.player.username = data.username;
                client.player.id = data.userId;
                client.player.gameRoom = data.room;
                client.player.socketId = client.id;

                this.games[data.room] = new Mesa();
                this.games[data.room].gameRoom = data.room;
                this.games[data.room].gamers.push(data.username);
                this.games[data.room].ids.push(data.userId);
                this.games[data.room].sockets.push(client.id);
            })

            client.on('join', (data: any) => {
                console.log("One player joined the room " + data.room);
                client.player.gameRoom = data.room;
                client.player.socketId = data.id;
                client.player.username = data.username;
                client.join(client.player.gameRoom);

                this.games[data.room].gamers.push(data.username);
                this.games[data.room].ids.push(data.userId);
                this.games[data.room].sockets.push(client.id);
            })

            client.on('start-game', (data: any) => {
                console.log("Game will start" + data.room + " sdad " + client.player.gameRoom);
                this.io.to(client.player.gameRoom).emit('game-start', client.player.gameRoom);
                console.log('GAME WILL START ->' + client.player.gameRoom)
                this.io.emit(client.player.gameRoom).emit('game-start', client.player.gameRoom);
                this.games[data.room].gamers.forEach((player: any) => {
                    console.log(player);
                });

                console.log(this.games[data.room].getSuit());
                this.io.to(client.player.gameRoom).emit('suit', this.games[data.room].getSuit());

                ///this.games[data.room].gamers.forEach((player:any) => {

                let index = 0;
                this.games[data.room].sockets.forEach((client: string) => {
                    console.log(index);
                    this.io.to(client).emit('my-cards', { room: data.room, card: this.games[data.room].cards[0 + index] });
                    this.io.to(client).emit('my-cards', { room: data.room, card: this.games[data.room].cards[1 + index] });
                    this.io.to(client).emit('my-cards', { room: data.room, card: this.games[data.room].cards[2 + index] });
                    this.io.to(client).emit('my-cards', { room: data.room, card: this.games[data.room].cards[3 + index] });
                    this.io.to(client).emit('my-cards', { room: data.room, card: this.games[data.room].cards[4 + index] });
                    this.io.to(client).emit('my-cards', { room: data.room, card: this.games[data.room].cards[5 + index] });
                    this.io.to(client).emit('my-cards', { room: data.room, card: this.games[data.room].cards[6 + index] });
                    this.io.to(client).emit('my-cards', { room: data.room, card: this.games[data.room].cards[7 + index] });
                    this.io.to(client).emit('my-cards', { room: data.room, card: this.games[data.room].cards[8 + index] });
                    this.io.to(client).emit('my-cards', { room: data.room, card: this.games[data.room].cards[9 + index] });
                    index += 10;
                });

                this.games[data.room].gamers.forEach((player: any) => {
                    console.log("PLayers: " + player);
                    this.io.to(client.player.gameRoom).emit('players-on-game', player);
                });

                this.games[data.room].startRound();
                console.log(this.games[data.room].rounds[0].firstPlayer);
                //send first player from match
                this.io.to(client.player.gameRoom).emit('turn', { username: this.games[data.room].rounds[0].firstPlayer, round: this.games[data.room].round });
            });

            client.on('players-on-game', (data: any) => {
                this.games[data.room].gamers.forEach((player: any) => {
                    this.io.to(client.player.gameRoom).emit('players-on-game', player);
                });
            });

            //quando recebe uma carta
            client.on('card', (data: any) => {
                //console.log(data.card, "User " + data.username);
                console.log(data.round, data.username, data.card);
                this.games[data.room].addMove(data.round, data.username, data.card);
                this.io.to(client.player.gameRoom).emit('move', data);

                //console.log("1"+this.games[data.room].rounds[data.round].player1_option);
                //console.log("2"+this.games[data.room].rounds[data.round].player2_option);
                //console.log("3"+this.games[data.room].rounds[data.round].player3_option);
                //console.log("4"+this.games[data.room].rounds[data.round].player4_option);

                if (this.games[data.room].rounds[data.round].player1_option != null &&
                    this.games[data.room].rounds[data.round].player2_option != null &&
                    this.games[data.room].rounds[data.round].player3_option != null &&
                    this.games[data.room].rounds[data.round].player4_option != null) {
                    this.games[data.room].calculateRound(data.round);
                    //TODO: emit winner round and points
                    console.log("WINNER" + this.games[data.room].rounds[data.round].winner);
                    console.log("POINTS: " + this.games[data.room].rounds[data.round].points);

                    if (this.games[data.room].round != 10) {

                        this.io.to(client.player.gameRoom).emit('round', { round: data.round, points: this.games[data.room].rounds[data.round].points, winner: this.games[data.room].rounds[data.round].winner })
                        console.log("STARTING ROUND " + this.games[data.room].round);
                        this.games[data.room].startRound();
                        this.io.to(client.player.gameRoom).emit('turn', { username: this.games[data.room].rounds[this.games[data.room].round].firstPlayer, round: this.games[data.room].round });
                    } else {
                        //FINISH GAME
                        console.log("FINISH GAME");
                        this.games[data.room].finishGame(data.room);
                        this.io.to(client.player.gameRoom).emit('final', {winner1 : this.games[data.room].winner1, winner2 : this.games[data.room].winner2});
                    }

                } else {
                    let nextplayer: string = "";
                    nextplayer = this.games[data.room].nextPlayer(data.round, data.username);
                    console.log("NEXT PLAYER => " + nextplayer);
                    console.log("ROUND " + this.games[data.room].round);
                    this.io.to(client.player.gameRoom).emit('turn', { username: nextplayer, round: this.games[data.room].round });
                }

            });

        });
    };

    public notifyAll = (channel: string, message: any) => {
        this.io.sockets.emit(channel, message);
    };
};

export class Round {
    public firstPlayer: string;
    public secondPlayer: string;
    public thirdPlayer: string;
    public fourPlayer: string;

    public player1_option: Card;
    public player2_option: Card;
    public player3_option: Card;
    public player4_option: Card;

    public winner: string;
    public points: number;
}

export class Player {
    public username: string;
    public id: number;
    public gameRoom: string;
    public socketId: string;

}
export class Mesa {

    public gameRoom: string;

    public gamers: string[] = [];
    public ids: string[] = [];
    public sockets: string[] = [];

    public round: number = 0;
    public rounds: Round[] = [];

    public winner1 : string ="";
    public winner2 : string ="";


    public cards: Card[];

    constructor() {
        this.gameRoom = '';
        this.gamers = [];
        this.sockets = [];
        this.cards = [];

        Mesa.todosOsNaipes().forEach(naipe => {
            Mesa.todosOsSimbolos().forEach(simbolo => {
                let c: Card = null;
                let img = '../img/cards/' + naipe + simbolo + ".png"
                switch (simbolo) {
                    case 1: c = new Card(naipe, simbolo, 11, img);
                        break;
                    case 7: c = new Card(naipe, simbolo, 10, img);
                        break;
                    case 13: c = new Card(naipe, simbolo, 4, img);
                        break;
                    case 11: c = new Card(naipe, simbolo, 3, img);
                        break;
                    case 12: c = new Card(naipe, simbolo, 2, img);
                        break;
                    default: c = new Card(naipe, simbolo, 0, img);
                }
                this.cards.push(c);
            });
        });

        this.baralharCartas();
    }

    public getSuit(): Card {
        return this.cards[this.cards.length - 1];
    }

    public startRound() {
        this.rounds[this.round] = new Round();
        if (this.round == 0) {
            this.rounds[this.round].firstPlayer = this.gamers[0];
            this.rounds[this.round].secondPlayer = this.gamers[1];
            this.rounds[this.round].thirdPlayer = this.gamers[2];
            this.rounds[this.round].fourPlayer = this.gamers[3];
        } else {
            console.log("STARTING ROUND: " + this.round);
            this.rounds[this.round].firstPlayer = this.rounds[this.round - 1].winner;

            if (this.rounds[this.round].firstPlayer == this.gamers[0]) {
                this.rounds[this.round].secondPlayer = this.gamers[1];
                this.rounds[this.round].thirdPlayer = this.gamers[2];
                this.rounds[this.round].fourPlayer = this.gamers[3];
            } else if (this.rounds[this.round].firstPlayer == this.gamers[1]) {
                this.rounds[this.round].secondPlayer = this.gamers[2];
                this.rounds[this.round].thirdPlayer = this.gamers[3];
                this.rounds[this.round].fourPlayer = this.gamers[0];
            } else if (this.rounds[this.round].firstPlayer == this.gamers[2]) {
                this.rounds[this.round].secondPlayer = this.gamers[3];
                this.rounds[this.round].thirdPlayer = this.gamers[0];
                this.rounds[this.round].fourPlayer = this.gamers[1];
            } else if (this.rounds[this.round].firstPlayer == this.gamers[3]) {
                this.rounds[this.round].secondPlayer = this.gamers[0];
                this.rounds[this.round].thirdPlayer = this.gamers[1];
                this.rounds[this.round].fourPlayer = this.gamers[2];
            }
        }
    }

    public addMove(round: number, player: string, card: Card) {

        if (this.gamers[0] == player) {
            this.rounds[round].player1_option = card;
        } else if (this.gamers[1] == player) {
            this.rounds[round].player2_option = card;
        } else if (this.gamers[2] == player) {
            this.rounds[round].player3_option = card;
        } else if (this.gamers[3] == player) {
            this.rounds[round].player4_option = card;
        } else {
            console.log("error.not find player");
        }

        /*        if (this.rounds[round].player1_option != null && this.rounds[round].player2_option != null && this.rounds[round].player3_option != null && this.rounds[round].player4_option != null) {
                    this.calculateRound(this.round);
                }*/
    }
    public calculateRound(round: number) {
        //getCartasUsadas
        console.log("\n\n\n\nAVALIACAO DA RONDA : " + round)

        let card1: any = this.rounds[round].player1_option;
        let card2: any = this.rounds[round].player2_option;
        let card3: any = this.rounds[round].player3_option;
        let card4: any = this.rounds[round].player4_option;

        console.log(card1);

        //GET TRUNFO
        let trunfo: string = this.cards[39].tipoCard;
        console.log("TRUNFO : " + trunfo);
        //GET NAIPE DA JOGADA
        let tipo: string;
        if (this.rounds[round].firstPlayer === this.gamers[0]) {
            tipo = card1._tipoCard;
        } else if (this.rounds[round].firstPlayer == this.gamers[1]) {
            tipo = card2._tipoCard;
        } else if (this.rounds[round].firstPlayer == this.gamers[2]) {
            tipo = card3._tipoCard;
        } else if (this.rounds[round].firstPlayer == this.gamers[3]) {
            tipo = card4._tipoCard;
        }
        console.log("NAIPE DA JOGADA: " + tipo);

        //COUNT TRUNFOS
        let countTrunfos: number = 0;
        let card1trunfo: boolean = false;
        let card2trunfo: boolean = false;
        let card3trunfo: boolean = false;
        let card4trunfo: boolean = false;

        if (card1._tipoCard == trunfo) { countTrunfos++; card1trunfo = true; }
        if (card2._tipoCard == trunfo) { countTrunfos++; card2trunfo = true; }
        if (card3._tipoCard == trunfo) { countTrunfos++; card3trunfo = true; }
        if (card4._tipoCard == trunfo) { countTrunfos++; card4trunfo = true; }

        //se apenas foi usado um trunfo na ronda ele ganha
        if (countTrunfos == 1) {
            if (card1._tipoCard == trunfo) {
                this.rounds[round].winner = this.gamers[0];
            } else if (card2._tipoCard == trunfo) {
                this.rounds[round].winner = this.gamers[1];
            } else if (card3._tipoCard == trunfo) {
                this.rounds[round].winner = this.gamers[2];
            } else if (card4._tipoCard == trunfo) {
                this.rounds[round].winner = this.gamers[3];
            }

            console.log("APENAS UM TRUNFO. WINNER É " + this.rounds[round].winner);
        }

        //se foi usado mais que um trunfo ganha o que tiver o trunfo mais alto
        if (countTrunfos > 1) {
            let higherCard: number = -1;
            let winner: string;

            if (card1trunfo && card1._ponto > higherCard) {
                higherCard = card1._ponto;
                winner = this.gamers[0];
            }

            if (card2trunfo && card2._ponto > higherCard) {
                higherCard = card2._ponto;
                winner = this.gamers[1];
            }

            if (card3trunfo && card3._ponto > higherCard) {
                higherCard = card3._ponto;
                winner = this.gamers[2];
            }

            if (card4trunfo && card4._ponto > higherCard) {
                higherCard = card4._ponto;
                winner = this.gamers[3];
            }

            this.rounds[round].winner = winner;

            console.log("VARIOS TRUNFOS . VENCEDOR É : " + this.rounds[round].winner);
        }
        //se nao houver trunfos, ganha quem tiver ganho posto a carta mais alta do naipe que o 1 jogador colocou
        if (countTrunfos == 0) {
            console.log("NAO HOUVE TRUNFOS JOGADOS");
            let higherCard: number = -1;
            let winner: string;
            if (card1._tipoCard == tipo && card1._ponto > higherCard) {
                higherCard = card1._ponto;
                winner = this.gamers[0];

            }
            if (card2._tipoCard == tipo && card2._ponto > higherCard) {
                higherCard = card2._ponto;
                winner = this.gamers[1];
            }

            if (card3._tipoCard == tipo && card3._ponto > higherCard) {
                higherCard = card3._ponto;
                winner = this.gamers[2];
            }

            if (card4._tipoCard == tipo && card4._ponto > higherCard) {
                higherCard = card4._ponto;
                winner = this.gamers[3];
            }
            this.rounds[round].winner = winner;
        }
        //ADICIONA OS PONTOS E COMEÇA NOVA RONDA
        this.rounds[round].points = card1._ponto + card2._ponto + card3._ponto + card4._ponto;
        console.log("NUMERO DE PONTOS DA JOGADA " + this.rounds[round].points);
        console.log("FINAL VENCEDOR DA RONDA: " + this.rounds[round].winner);
        this.round++;
        //this.startRound();
    }

    public finishGame(room: string) {
        let player1: string = this.gamers[0];
        let totalPointsPlayer1: number = 0;
        let player2: string = this.gamers[1];
        let totalPointsPlayer2: number = 0;
        let player3: string = this.gamers[2];
        let totalPointsPlayer3: number = 0;
        let player4: string = this.gamers[3];
        let totalPointsPlayer4: number = 0;

        let winner1: string = "";
        let winner2: string = "";

        this.rounds.forEach((r: Round) => {
            //get WINNER points
            if (r.winner == player1) {
                totalPointsPlayer1 += r.points;
            } else if (r.winner == player2) {
                totalPointsPlayer2 += r.points;
            } else if (r.winner == player3) {
                totalPointsPlayer3 += r.points;
            } else if (r.winner == player4) {
                totalPointsPlayer4 += r.points;
            } else {
                //error
            }
        });

        //control
        console.log(totalPointsPlayer1 + " " + totalPointsPlayer2 + " " + totalPointsPlayer3 + " " + totalPointsPlayer4);

        let totalPointsTeam1: number = 0;
        let totalPointsTeam2: number = 0;

        totalPointsTeam1 = totalPointsPlayer1 + totalPointsPlayer3;
        totalPointsTeam2 = totalPointsPlayer2 + totalPointsPlayer4;

        //control   
        console.log(totalPointsTeam1 + " " + totalPointsTeam2);

        let starsTeam1: number = 0;
        let starsTeam2: number = 0;

        if (totalPointsTeam1 > totalPointsTeam2) {
            //TEAM 1 WON
            console.log("TEAM 1 WON");
            if (totalPointsTeam1 == 120) {
                console.log("5*");
                starsTeam1 = 5;
            } else if (totalPointsTeam1 >= 91 && totalPointsTeam1 <= 119) {
                console.log("3*");
                starsTeam1 = 3;
            } else if (totalPointsTeam1 >= 61 && totalPointsTeam1 <= 90) {
                console.log("2*");
                starsTeam1 = 2;
            }
            winner1 = this.gamers[0];
            winner2 = this.gamers[2];

        } else if (totalPointsTeam1 < totalPointsTeam2) {
            //TEAM 2 WON
            console.log("TEAM 2 WON");
            if (totalPointsTeam2 == 120) {
                console.log("5*");
                starsTeam2 = 5;
            } else if (totalPointsTeam2 >= 91 && totalPointsTeam2 <= 119) {
                console.log("3*");
                starsTeam2 = 3;
            } else if (totalPointsTeam2 >= 61 && totalPointsTeam2 <= 90) {
                console.log("2*");
                starsTeam2 = 2;
            }

            winner1 = this.gamers[1];
            winner2 = this.gamers[3];

        } else if (totalPointsTeam1 == totalPointsTeam2) {
            //TIE
            console.log("TIE");
            console.log("1* to each");
            starsTeam1 = 1;
            starsTeam2 = 1;

        } else {
            //error
            console.log("ERROR");
        }

        this.winner1 = winner1;
        this.winner2 = winner2;

        //WRITE TO GAME DB
        let idRoom = room.substring(4);

        let currentdate = new Date();
        let datetime = currentdate.getDate() + "-"
            + (currentdate.getMonth() + 1) + "-"
            + currentdate.getFullYear() + " "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

        const id = new mongodb.ObjectID(idRoom);
        const game = {
            finish: "YES",
            dateFinish: datetime,
            winner1: winner1,
            winner2: winner2,
            status: "finish",
            players: [
                { username: player1, points: totalPointsPlayer1, stars: starsTeam1 },
                { username: player2, points: totalPointsPlayer2, stars: starsTeam2 },
                { username: player3, points: totalPointsPlayer3, stars: starsTeam1 },
                { username: player4, points: totalPointsPlayer4, stars: starsTeam2 }
            ]
        };

        if (game === undefined) {
            console.log("ERROR UPDATING GAME FINAL STATUS");
        }
        database.db.collection('games')
            .updateOne({
                _id: id
            }, {
                $set: game
            })
            .then((result: any) => console.log("UPDATE WITH SUCCESS"))
            .catch((err: any) => console.log("ERROR UPDATING"));

        this.writeUserToDB(this.ids[0], starsTeam1, totalPointsPlayer1);
        this.writeUserToDB(this.ids[1], starsTeam2, totalPointsPlayer2);
        this.writeUserToDB(this.ids[2], starsTeam1, totalPointsPlayer3);
        this.writeUserToDB(this.ids[3], starsTeam2, totalPointsPlayer4);

    }

    public writeUserToDB(player: string, newStars: number, newPoints: number) {
        let oldstars: any;
        let oldpoints: any;

        database.db.collection('users')
            .findOne({
                _id: player
            })
            .then((user: any) => {
                console.log(user);
                oldstars = user.totalStars;
                oldpoints = user.totalPoints;

                console.log("OLD PLAYER: " + player);
                console.log(oldstars + " " + oldpoints);

                let stars: number = oldstars + newStars;
                let points: number = oldpoints + newPoints;

                database.db.collection('users')
                    .updateOne({
                        username: player
                    }, {
                        $set: { totalStars: stars, totalPoints: points }
                    })
                    .then((result: any) => console.log("PLAYER " + player + " UPDATED WITH SUCCESS"))

            })

    }

    public baralharCartas() {
        let j: number, k: Card;
        for (let i = this.cards.length; i; i--) {
            j = Math.floor(Math.random() * i);
            k = this.cards[i - 1];
            this.cards[i - 1] = this.cards[j];
            this.cards[j] = k;

        }
        console.log(this.cards);
    }

    public getCard(naipe: string, simbolo: number): Card {

        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].tipoCard == naipe && this.cards[i].simbolo == simbolo) {
                return this.cards[i];
            }
        }

        return;
    }

    public nextPlayer(round: number, lastPlayer: string): string {
        if (this.rounds[round].firstPlayer == lastPlayer) {
            return this.rounds[round].secondPlayer;
        } else if (this.rounds[round].secondPlayer == lastPlayer) {
            return this.rounds[round].thirdPlayer;
        } else if (this.rounds[round].thirdPlayer == lastPlayer) {
            return this.rounds[round].fourPlayer;
        }
        return "";
    }

    public static todosOsNaipes(): string[] {
        return ['o', 'e', 'p', 'c'];
    }

    public static todosOsSimbolos(): number[] {
        return [1, 2, 3, 4, 5, 6, 7, 11, 12, 13];
    }
}

export class Card {
    private _tipoCard: string;
    private _simbolo: number;
    private _isAval: boolean;
    private _ponto: number;
    private _img: string;

    public constructor(tipo: string, id: number, pontos: number, img: string) {
        this._tipoCard = tipo;
        this._simbolo = id;
        this._isAval = true;
        this._ponto = pontos;
        this._img = img;
    }

    public toString() {
        return "Naipe: " + this._tipoCard + " Simbolo: " + this._simbolo + " Pontos: " + this._ponto + "\n";
    }


    get tipoCard(): string {
        return this._tipoCard;
    }

    set tipoCard(value: string) {
        this._tipoCard = value;
    }

    get simbolo(): number {
        return this._simbolo;
    }

    set simbolo(value: number) {
        this._simbolo = value;
    }

    get isAval(): boolean {
        return this._isAval;
    }

    set isAval(value: boolean) {
        this._isAval = value;
    }

    get ponto(): number {
        return this._ponto;
    }

    set ponto(value: number) {
        this._ponto = value;
    }


    get img(): string {
        return this._img;
    }

    set img(value: string) {
        this._img = value;
    }
}