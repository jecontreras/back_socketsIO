import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';
import { Mapa } from '../classes/mapa';
import { Marcador } from '../classes/marcador';


export const usuariosConectados = new UsuariosLista();
export const mapa = new Mapa();


//Evento de mapa
export const mapaSockets = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on( 'marcador-nuevo', ( marcador: Marcador ) => {
        mapa.agregarMarcador( marcador );
        let mapasData:any = mapa.getMarcadores();
        let filtro: Marcador = mapasData[cliente.id];
        if(filtro) {
            mapa.eventosBackend( filtro, true);
            filtro.estado = true;
            cliente.broadcast.emit( 'marcador-nuevo', filtro );
        }
        cliente.broadcast.emit( 'marcador-nuevo', marcador );
    });

    cliente.on( 'marcador-borrar', ( id: string ) => {
        mapa.borrarMarcador( id );
        cliente.broadcast.emit( 'marcador-borrar', id );
    });

    cliente.on( 'marcador-mover', ( marcador: Marcador ) => {
        mapa.moverMarcador( marcador );
        cliente.broadcast.emit( 'marcador-mover', marcador );
    });

    cliente.on( 'orden-nuevo', ( orden: any ) => {
        cliente.broadcast.emit( 'orden-nuevo', orden );
    });

    cliente.on( 'ofreciendo-nuevo', ( orden: any ) => {
        cliente.broadcast.emit( 'ofreciendo-nuevo', orden );
    });

    cliente.on( 'orden-actualizada', ( orden: any ) => {
        cliente.broadcast.emit( 'orden-actualizada', orden );
    });

    cliente.on( 'orden-confirmada', ( orden: any ) => {
        cliente.broadcast.emit( 'orden-confirmada', orden );
    });

    cliente.on( 'orden-finalizada', ( orden: any ) => {
        cliente.broadcast.emit( 'orden-finalizada', orden );
    });

    cliente.on('orden-cancelada', (orden) => {
        cliente.broadcast.emit('orden-cancelada', orden);
    });
    // orden-programada
    cliente.on('orden-programada-creado', (orden) => {
        cliente.broadcast.emit('orden-programada-creado', orden);
    });
    cliente.on('orden-programada-eliminada', (orden) => {
        cliente.broadcast.emit('orden-programada-eliminada', orden);
    });
    cliente.on('orden-programada-editada', (orden) => {
        cliente.broadcast.emit('orden-programada-editada', orden);
    });
    // Ofertando orden-programada
    cliente.on('ofreciendo-orden-programada', (orden) => {
        cliente.broadcast.emit('ofreciendo-orden-programada', orden);
    });

    // Ofertando orden-programada
    cliente.on('chat-nuevo', (chat) => {
        cliente.broadcast.emit('chat-nuevo', chat);
    });

    cliente.on('drive', (drive) => {
        cliente.broadcast.emit('drive', drive);
    });

    // Adminstracion cambios
    cliente.on('administracion', (admin) => {
        cliente.broadcast.emit('administracion', admin);
    });
    

};








export const conectarCliente = ( cliente: Socket, io: socketIO.Server ) => {

    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );
    let mapasData:any = mapa.getMarcadores();
    let filtro: Marcador = mapasData[cliente.id];
    //console.log("****",filtro, mapasData, cliente);
    if(filtro) {
        mapa.eventosBackend( filtro, true);
        filtro.estado = true;
        cliente.broadcast.emit( 'marcador-nuevo', filtro );
    }
}


export const desconectar = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');    

        usuariosConectados.borrarUsuario( cliente.id );

        io.emit('usuarios-activos', usuariosConectados.getLista()  );
        let mapasData:any = mapa.getMarcadores();
        let filtro = mapasData[cliente.id];
        //console.log(filtro)
        if(filtro) {
            mapa.eventosBackend( filtro, false);
            filtro.estado = false;
            //mapa.borrarMarcador( filtro.id );
            cliente.broadcast.emit( 'marcador-borrar', filtro.id );
        }
        

    });

}


// Escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('mensaje', (  payload: { de: string, cuerpo: string }  ) => {

        console.log('Mensaje recibido', payload );

        io.emit('mensaje-nuevo', payload );

    });

}

// Configurar usuario
export const configurarUsuario = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('configurar-usuario', (  payload: { nombre: string }, callback: Function  ) => {

        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );

        io.emit('usuarios-activos', usuariosConectados.getLista()  );

        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre }, configurado`
        });
    });

}


// Obtener Usuarios
export const obtenerUsuarios = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('obtener-usuarios', () => {

        io.to( cliente.id ).emit('usuarios-activos', usuariosConectados.getLista()  );
        
    });

}
