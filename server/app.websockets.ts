const io = require('socket.io');

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
                this.games[data.room].sockets.push(client.id);
            })

            client.on('join', (data: any) => {
                console.log("One player joined the room " + data.room);
                client.player.gameRoom = data.room;
                client.player.socketId = data.id;
                client.player.username = data.username;
                client.join(client.player.gameRoom);

                this.games[data.room].gamers.push(data.username);
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

                if (this.games[data.room].rounds[data.round].player1_option != null &&
                    this.games[data.room].rounds[data.round].player2_option != null &&
                    this.games[data.room].rounds[data.round].player3_option != null &&
                    this.games[data.room].rounds[data.round].player4_option != null) {
                    this.games[data.room].calculateRound(data.round);
                    //TODO: emit winner round and points
                } else {
                    let nextplayer : string = "";
                    nextplayer = this.games[data.room].nextPlayer(data.round, data.username);
                    console.log("NEXT PLAYER => "+ nextplayer);
                    console.log("ROUND "+ this.games[data.room].round);
                    this.io.to(client.player.gameRoom).emit('turn',{ username: nextplayer, round: this.games[data.room].round } );
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
    public sockets: string[] = [];

    public round: number = 0;
    public rounds: Round[] = [];

    public cards: Card[];

    constructor() {
        this.gameRoom = '';
        this.gamers = [];
        this.sockets = [];
        this.cards = [];

        Mesa.todosOsNaipes().forEach(naipe => {
            Mesa.todosOsSimbolos().forEach(simbolo => {
                let c: Card = null;
                let img = '../../cards/' + naipe + simbolo + ".png"
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
            this.rounds[this.round].firstPlayer = this.rounds[this.round - 1].winner;
            //NEED COMPLETE
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

        if (this.rounds[round].player1_option != null && this.rounds[round].player2_option != null && this.rounds[round].player3_option != null && this.rounds[round].player4_option != null) {
            this.calculateRound(this.round);
        }
    }
    public calculateRound(round: number) {
        //getCartasUsadas
        let card1: Card = this.rounds[round].player1_option;
        let card2: Card = this.rounds[round].player2_option;
        let card3: Card = this.rounds[round].player3_option;
        let card4: Card = this.rounds[round].player4_option;

        //GET TRUNFO
        let trunfo: string = this.getSuit().tipoCard;
        //GET NAIPE DA JOGADA
        let tipo: string;
        if (this.rounds[round].firstPlayer == this.gamers[0]) {
            tipo = card1.tipoCard;
        } else if (this.rounds[round].firstPlayer == this.gamers[1]) {
            tipo = card2.tipoCard;
        } else if (this.rounds[round].firstPlayer == this.gamers[2]) {
            tipo = card3.tipoCard;
        } else if (this.rounds[round].firstPlayer == this.gamers[3]) {
            tipo = card4.tipoCard;
        }
        //COUNT TRUNFOS
        let countTrunfos: number = 0;
        let card1trunfo: boolean = false;
        let card2trunfo: boolean = false;
        let card3trunfo: boolean = false;
        let card4trunfo: boolean = false;

        if (card1.tipoCard == trunfo) { countTrunfos++; card1trunfo = true; }
        if (card2.tipoCard == trunfo) { countTrunfos++; card2trunfo = true; }
        if (card3.tipoCard == trunfo) { countTrunfos++; card3trunfo = true; }
        if (card4.tipoCard == trunfo) { countTrunfos++; card4trunfo = true; }

        //se apenas foi usado um trunfo na ronda ele ganha
        if (countTrunfos == 1) {
            if (card1.tipoCard == trunfo) {
                this.rounds[round].winner = this.gamers[0];
            } else if (card2.tipoCard == trunfo) {
                this.rounds[round].winner = this.gamers[1];
            } else if (card3.tipoCard == trunfo) {
                this.rounds[round].winner = this.gamers[2];
            } else if (card4.tipoCard == trunfo) {
                this.rounds[round].winner = this.gamers[3];
            }
        }

        //se foi usado mais que um trunfo ganha o que tiver o trunfo mais alto
        if (countTrunfos > 1) {
            let higherCard: number = 0;
            let winner: string;

            if (card1trunfo) {
                if (card1.ponto > higherCard) {
                    higherCard = card1.ponto;
                    winner = this.gamers[0];
                }
            }
            if (card2trunfo) {
                if (card2.ponto > higherCard) {
                    higherCard = card2.ponto;
                    winner = this.gamers[1];
                }
            }
            if (card3trunfo) {
                if (card3.ponto > higherCard) {
                    higherCard = card3.ponto;
                    winner = this.gamers[2];
                }
            }
            if (card4trunfo) {
                if (card4.ponto > higherCard) {
                    higherCard = card4.ponto;
                    winner = this.gamers[3];
                }
            }

            this.rounds[round].winner = winner;
        }
        //se nao houver trunfos, ganha quem tiver ganho posto a carta mais alta do naipe que o 1 jogador colocou
        if (countTrunfos == 0) {
            let higherCard: number = 0;
            let winner: string;
            if (card1.tipoCard == tipo) {
                if (card1.ponto > higherCard) {
                    higherCard = card1.ponto;
                    winner = this.gamers[0];
                }
            }
            if (card2.tipoCard == tipo) {
                if (card2.ponto > higherCard) {
                    higherCard = card2.ponto;
                    winner = this.gamers[1];
                }
            }
            if (card3.tipoCard == tipo) {
                if (card3.ponto > higherCard) {
                    higherCard = card3.ponto;
                    winner = this.gamers[2];
                }
            }
            if (card4.tipoCard == tipo) {
                if (card4.ponto > higherCard) {
                    higherCard = card4.ponto;
                    winner = this.gamers[3];
                }
            }
        }
        //ADICIONA OS PONTOS E COMEÇA NOVA RONDA
        this.rounds[round].points = card1.ponto + card2.ponto + card3.ponto + card4.ponto;
        this.round++;
        this.startRound();
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

    public nextPlayer(round: number, lastPlayer: string):string {
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