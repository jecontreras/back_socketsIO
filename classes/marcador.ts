export class Marcador {

    constructor(
        public id: string,
        public nombre:string,
        public socketId:string,
        public estado: boolean,
        public userID: string,
        public rol: string,
        public lng: number,
        public lat: number,
        public color: string
    ){
        
    }
}