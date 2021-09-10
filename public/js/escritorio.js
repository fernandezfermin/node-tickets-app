
// Referencias HTML
const lblDesk = document.querySelector('h1');
const btnAtender    = document.querySelector('button');
const lblTicket     = document.querySelector('small');
const divAlerta     = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');


const searchParams = new URLSearchParams( window.location.search );

if ( !searchParams.has('Desk') ) {
    window.location = 'index.html';
    throw new Error('El Desk es obligatorio');
}

const Desk = searchParams.get('Desk');
lblDesk.innerText = Desk;

divAlerta.style.display = 'none';


const socket = io();


socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', ( pendientes ) => {
    if ( pendientes === 0 ) {
        lblPendientes.style.display = 'none';
    } else {
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes;
    }
})


btnAtender.addEventListener( 'click', () => {
    

    socket.emit( 'atender-ticket', { Desk }, ( { ok, ticket, msg } ) => {
        
        if ( !ok ) {
            lblTicket.innerText = 'Nadie.';
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = 'Ticket ' + ticket.numero;

    });
    // socket.emit( 'siguiente-ticket', null, ( ticket ) => {
    //     lblNuevoTicket.innerText = ticket;
    // });

});



