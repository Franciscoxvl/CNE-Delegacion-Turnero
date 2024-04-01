let turno;
let valorGuardado = localStorage.getItem('turno');

if (valorGuardado){
    var turno_puesto = document.getElementById("turno_actual");
    turno_puesto.textContent = valorGuardado;
};
// Configuración del objeto socket
var socket = io.connect('http://10.0.17.68:5000');  // Reemplaza con la URL de tu servidor Socket.IO


// Manejador de eventos para el evento 'connect'
socket.on('connect', function() {
    console.log('Conexión establecida correctamente al servidor Socket.IO');
});

socket.on('turno_espera', () => {
    actualizarTabla();
});

socket.on('turno_asignado', (data) => {
    if (data.puesto == 4){
        var codigo = data.codigo;
        var numero_turno = data.numero_turno;
        var turno = codigo + numero_turno;
        localStorage.setItem('turno', turno);
        var turno_puesto = document.getElementById("turno_actual");
        turno_puesto.textContent = turno;
    }
});


// Manejador de eventos para el evento 'disconnect'
socket.on('disconnect', function() {
    console.log('Desconectado del servidor Socket.IO');
});

// Manejador de eventos para el evento 'connect_error'
socket.on('connect_error', function(error) {
    console.error('Error al intentar conectar:', error);
});

// Manejador de eventos para el evento 'connect_timeout'
socket.on('connect_timeout', function(timeout) {
    console.error('Tiempo de conexión agotado:', timeout);
});

// Manejador de eventos para el evento 'reconnect'
socket.on('reconnect', function(attemptNumber) {
    console.log('Reconexión exitosa (intento número ' + attemptNumber + ')');
});

// Función para liberar un puesto
const liberarPuesto = (puestoId) => {
    socket.emit('liberar_puesto', { puestoId });
}

// Function to update the table with AJAX
const actualizarTabla = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://10.0.17.68:5000/api/actualizar_tabla'); // Replace with your API endpoint
        
    xhr.onload = function() {
    if (xhr.status === 200) {
        const nuevosTurnos = JSON.parse(xhr.responseText); // Assuming JSON response
        actualizarTablaConNuevosDatos(nuevosTurnos);
        console.log(nuevosTurnos)
    } else {
        console.error('Error al obtener los datos:', xhr.statusText);
    }
    };

    xhr.send();
}

// Function to update the table content with new data
const actualizarTablaConNuevosDatos = (nuevosTurnos) => {
    const tablaBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

    // Clear existing table content (optional)
    tablaBody.innerHTML = ''; // Uncomment to clear existing rows

    // Loop through new data and update table rows
    for (const turno of nuevosTurnos) {
    const nuevaFila = document.createElement('tr');
    
    const celdaCodigoServicio = document.createElement('td');
    celdaCodigoServicio.textContent = turno.codigo_turno + turno.id_turno;
    nuevaFila.appendChild(celdaCodigoServicio);

    const celdaServicio = document.createElement('td');
    celdaServicio.textContent = turno.servicio;
    nuevaFila.appendChild(celdaServicio);

    const celdaFecha = document.createElement('td');
    celdaFecha.textContent = turno.fecha_solicitud;
    nuevaFila.appendChild(celdaFecha);

    tablaBody.appendChild(nuevaFila);
    }
}





