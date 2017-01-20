export class Card{
    private _tipoCard: string;
    private _simbolo: number;
    private _isAval: boolean;
    private _ponto: number;

    public constructor (tipo: string, id: number, pontos: number){
        this._tipoCard = tipo;
        this._simbolo = id;
        this._isAval = true;
        this._ponto = pontos;
    }

    public toString(){
        return "Naipe: "+this._tipoCard+ " Simbolo: "+this._simbolo+" Pontos: "+ this._ponto + "\n";
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