
import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados, mapa } from '../sockets/socket';
import { GraficaData } from '../classes/grafica';

const router = Router();


//mapa

router.post('/mapa', ( req: Request, res: Response  ) => {
    let filtro:any = mapa.getMarcadores(); 
    let result:any = {};
    let rol:string = req.body.opt;
    let id:string = req.body.id;
    if(rol){
        result = {};
        for( let [id, marcador] of Object.entries(filtro) ){
            if(marcador['estado'] && marcador['rol'] == rol ){
                result[id] = marcador;
            }
        }
    }
    if(id){
        console.log(id); 
        result = {};
        for( let [id, marcador] of Object.entries(filtro) ){
            if(marcador['estado'] && marcador['id'] == id ){
                console.log(marcador)
                result[id] = marcador;
            }
        }
    }
    res.json( result );

});


//otra mierda
const grafica = new GraficaData();


router.get('/grafica', ( req: Request, res: Response  ) => {

    res.json( grafica.getDataGrafica() );

});

router.post('/grafica', ( req: Request, res: Response  ) => {

    const opcion   = Number( req.body.opcion );
    const unidades = Number( req.body.unidades );

    grafica.incrementarValor( opcion, unidades );

    const server = Server.instance;
    server.io.emit('cambio-grafica', grafica.getDataGrafica() );


    res.json( grafica.getDataGrafica() );

});


router.post('/mensajes/:id', ( req: Request, res: Response  ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const id     = req.params.id;

    const payload = {
        de,
        cuerpo
    }


    const server = Server.instance;

    server.io.in( id ).emit( 'mensaje-privado', payload );


    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });

});


// Servicio para obtener todos los IDs de los usuarios
router.get('/usuarios', (  req: Request, res: Response ) => {

    const server = Server.instance;

    server.io.clients( ( err: any, clientes: string[] ) => {

        if ( err ) {
            return res.json({
                ok: false,
                err
            })
        }


        res.json({
            ok: true,
            clientes
        });


    });

});

// Obtener usuarios y sus nombres
router.get('/usuarios/detalle', (  req: Request, res: Response ) => {


    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });

    
});




export default router;


