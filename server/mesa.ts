import { Card } from './card';

export class Mesa {

    public gameRoom : number;

    public gamers : string[] = [];

    public cards: Card[];

    constructor() {
        this.cards = [];

        Mesa.todosOsNaipes().forEach(naipe => {
            Mesa.todosOsSimbolos().forEach(simbolo => {
                let c: Card = null;
                let img = '../img/cards/'+ naipe+simbolo+".png"
                switch (simbolo){
                    case 1 : c = new Card(naipe, simbolo, 11,img);
                        break;
                    case 7 : c = new Card(naipe, simbolo, 10,img);
                        break;
                    case 13 : c = new Card(naipe, simbolo, 4,img);
                        break;
                    case 11 : c = new Card(naipe, simbolo, 3,img);
                        break;
                    case 12 : c = new Card(naipe, simbolo, 2,img);
                        break;
                    default : c = new Card(naipe, simbolo, 0,img);
                }
                this.cards.push(c);
            });
        });
    }

    public getCard(naipe:string, simbolo: number): Card {

        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].tipoCard == naipe && this.cards[i].simbolo == simbolo) {
                return this.cards[i];
            }
        }

        return;
    }

    public static todosOsNaipes(): string[]{
        return ['o','e','p','c'];
    }

    public static todosOsSimbolos(): number[]{
        return [1,2,3,4,5,6,7,11,12,13];
    }
}