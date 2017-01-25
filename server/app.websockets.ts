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

            client.on('lobby-chat', (data) => this.io.emit('lobby-chat', data));
            client.on('room-chat', (data) => {
                this.io.to(client.player.gameRoom).emit('room-chat', data)
            });



            client.on('room', (data) => {
                console.log("One room was created" + data.room);
                client.join(data.room); // o utilizador junta-se ao room que criou

                client.player.username = data.username;
                client.player.id = data.userId;
                client.player.gameRoom = data.room;
                client.player.socketId = client.id;

                this.games[data.room] = new Mesa();
                this.games[data.room].gameRoom = data.room;
                this.games[data.room].gamers.push(data.username);
            })

            client.on('join', (data) => {
                console.log("One player joined the room " + data.room);
                client.player.gameRoom = data.room;
                client.player.socketId = data.id;
                client.player.username = data.username;
                client.join(client.player.gameRoom);

                this.games[data.room].gamers.push(data.username);
            })

            client.on('start-game', (data) => {
                console.log("Game will start" + data.room + " sdad " + client.player.gameRoom);
                this.io.to(client.player.gameRoom).emit('game-start', client.player.gameRoom);
                console.log('GAME WILL START ->' + client.player.gameRoom)
                this.io.emit(client.player.gameRoom).emit('game-start', client.player.gameRoom);
                this.games[data.room].gamers.forEach((player: any) => {
                    console.log(player);
                });

                console.log(this.games[data.room].getSuit().toString());
                this.io.to(client.player.gameRoom).emit('suit', this.games[data.room].getSuit().toString());

            });

      /*      client.on('suit',(data)=>{
                console.log(this.games[data.room].getSuit().toString());
                this.io.to(client.player.gameRoom).emit('suit', this.games[data.room].getSuit().toString());
            })
*/
            client.on('players-on-game', (data) => {
                this.games[data.room].gamers.forEach((player: any) => {
                    this.io.to(client.player.gameRoom).emit('players-on-game', player);
                });
            });

        });
    };

    public notifyAll = (channel: string, message: any) => {
        this.io.sockets.emit(channel, message);
    };
};

export class Player {
    public username: string;
    public id: number;
    public gameRoom: string;
    public socketId: string;

}
export class Mesa {

    public gameRoom: string;

    public gamers: string[] = [];

    public cards: Card[];

    constructor() {
        this.gameRoom = '';
        this.gamers = [];
        this.cards = [];

        Mesa.todosOsNaipes().forEach(naipe => {
            Mesa.todosOsSimbolos().forEach(simbolo => {
                let c: Card = null;
                let img = '../../cards-1/' + naipe + simbolo + ".png"
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

    public getSuit() : Card{
        return this.cards[0];
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
}