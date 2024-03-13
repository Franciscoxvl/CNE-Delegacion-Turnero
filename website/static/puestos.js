// Lado del cliente (JavaScript)

// Configuración del objeto socket
var socket = io.connect('http://10.0.17.68:5000');  // Reemplaza con la URL de tu servidor Socket.IO


// Manejador de eventos para el evento 'connect'
socket.on('connect', function() {
    console.log('Conexión establecida correctamente al servidor Socket.IO');
});

socket.on('turno_espera', (data) => {
    var mensaje = document.getElementById('mensaje_servidor');
    mensaje.innerHTML = data;
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
function liberarPuesto(puestoId) {
    socket.emit('liberar_puesto', { puestoId: puestoId });
}





