export class Game {
    constructor(
        public _id: number,
        public UserOwner: string,
        public winner1: string,
        public winner2: string,
        public start : string,
        public nplayers : number,
        public finish : string,
        public status: string,
        public dateStart :string,
        public dateFinish : string,
        public players : any[]
    ) {  }
}