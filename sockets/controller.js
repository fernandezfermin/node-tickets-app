const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();



const socketController = (socket) => {

    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    socket.emit( 'estado-actual', ticketControl.ultimos4 );
    socket.emit( 'tickets-pendientes', ticketControl.tickets.length);
        

    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente();
        callback( siguiente );
        socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length);

    });

    socket.on('atender-ticket', ({ Desk }, callback) => {
        
        if ( !Desk ) {
            return callback({
                ok: false,
                msg: 'Desk is required'
            });
        }

        const ticket = ticketControl.atenderTicket( Desk );

        
        socket.broadcast.emit( 'estado-actual', ticketControl.ultimos4 );
        socket.emit( 'tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length);

        if ( !ticket ) {
            callback({
                ok: false,
                msg: 'There are no more pending tickets'
            });
        } else {
            callback({
                ok: true,
                ticket
            })
        }

    })

}



module.exports = {
    socketController
}

