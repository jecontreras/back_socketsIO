import { Marcador } from './marcador';
import { request } from 'http';
export class Mapa {
    
    private marcadores: { [key: string]: Marcador } = {
        // "1":{
        //     id: '1',
        //     nombre: 'Jose',
        //     lng: -75.75512993582937,
        //     lat: 45.349977429009954,
        //     color: "#dd8fee"
        //   },
        // "2":{
        //     id: '2',
        //     nombre: 'amy',
        //     lng: -75.75195645527508,
        //     lat: 45.351584045823756,
        //     color: "#790af0"
        //   },
        // "3":{
        //     id: '3',
        //     nombre: 'Orlando',
        //     lng: -75.75900589557777,
        //     lat: 45.34794635758547,
        //     color: "#19884b"
        //   } 
    };

    constructor(){

    }

    getMarcadores(){
        return this.marcadores;
    }

    async agregarMarcador( marcador: Marcador ){
        this.marcadores[ marcador.id ] = marcador;
        this.eventosBackend( marcador, true);
    }

    async eventosBackend( marcador: Marcador, estado:boolean ){
        let url:string = `apigps.herokuapp.com`//`https://apigps.herokuapp.com`;
        let path:string = `/personas/${marcador.userID}`;
        let data:object ={
            id: marcador.userID,
            conectado: estado,
            idSockets: marcador.id,
            latitud: marcador.lat,
            longitud: marcador.lng
        };
        await this.https(url, path, data, 'put' );
    }

    borrarMarcador( id:string ){
        delete this.marcadores[id];
        return this.getMarcadores();
    }

    moverMarcador( marcador: Marcador ){
        if( this.marcadores[marcador.id] && marcador ){
            this.marcadores[marcador.id].lng = marcador.lng;
            this.marcadores[marcador.id].lat = marcador.lat;
        }
    }

    async https(url:string, path:string, data:object, method:string){
        // let request = require('async-request'),
        return new Promise(resolve=>{
            try {
                const req = request(
                    {
                      host: url,
                      path: path,
                      //port: '1337',
                      method: method,
                      headers: {'Content-Type': 'application/json'}
                    },
                    response => {
                      console.log(response.statusCode); // 200
                      resolve(response.statusCode);
                    }
                  );
                  req.write(JSON.stringify(data));
                  req.end();
            } catch (e) {
                resolve(false);
            }
        });
    }
}