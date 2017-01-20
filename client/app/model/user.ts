/**
 * Created by joao on 16-01-2017.
 */

export class User {
    constructor(
        public _id: number,
        public username: string,
        public email: string,
        public token: string,
        public totalStars : number,
        public totalPoints : number,
        public password?: string,
        public passwordConfirmation?: string
    ) {  }
}