let turno;
let valorGuardadoJSON = localStorage.getItem('turno');
let valorGuardado = valorGuardadoJSON == null ? ["NA"] : JSON.parse(valorGuardadoJSON);
console.log(valorGuardadoJSON)
console.log(valorGuardado)

var input_puesto = document.getElementById("id_user");
let input_formulario = document.getElementById("numero_formulario");

if(input_formulario){
    input_formulario.value = "";
}
if (valorGuardado && input_puesto.value == valorGuardado[1]){
    
    var turno_puesto = document.getElementById("turno_actual");
    turno_puesto.textContent = valorGuardado[0];
}

// Configuración del objeto socket
var socket = io.connect('http://10.0.17.165');  // Reemplaza con la URL de tu servidor Socket.IO

// Manejador de eventos para el evento 'connect'
socket.on('connect', function() {
    console.log('Conexión establecida correctamente al servidor Socket.IO');
});

// Función para liberar un puesto
const liberarPuesto = (puestoId) => {
    if(puestoId.slice(0,3) == "VCD"){
        let n_formulario = document.getElementById("numero_formulario")
        let n_formulario_valor = n_formulario.value
        console.log(n_formulario_valor)
        console.log(valorGuardado[0])
        if (n_formulario_valor.length == 0 && valorGuardado[0] != "NA"){
            alert("Ingrese el numero de formulario!")
        }else{
            socket.emit('liberar_puesto', { puestoId, n_formulario_valor });
            n_formulario.value = ""
        }
        
    }else{
        let n_formulario_valor = 1
        socket.emit('liberar_puesto', { puestoId, n_formulario_valor });        
    }
    
}

socket.on('turno_espera', () => {
    actualizarTabla();
});

socket.on('turno_asignado', (data) => {
    var input_puesto = document.getElementById("id_user");
    var puesto_usuario = input_puesto.value;  
    var codigo = data.codigo;
    var numero_turno = data.numero_turno;
    var puesto = data.puesto;
    var turno = codigo + numero_turno;
    console.log(turno)
    console.log(puesto)
    var valor_a_guardar = [turno, puesto];
    valorGuardado = valor_a_guardar;
    console.log(valorGuardado[0])
    localStorage.setItem('turno', valorGuardado);
    var turno_puesto = document.getElementById("turno_actual");

    if (puesto_usuario == puesto){
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

socket.on('espera_asignacion', () => {
    var boton = document.getElementById("boton_liberar");
    boton.disabled = true;
    setTimeout(() => {
        boton.disabled = false;
    }, 1000);    
});

// Function to update the table with AJAX
const actualizarTabla = () => {
    const id_user = document.getElementById("id_user")
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://10.0.17.165/api/actualizar_tabla' + '?id_user=' + encodeURIComponent(id_user.value)); // Replace with your API endpoint

    xhr.onload = function() {
        if (xhr.status === 200) {
          var nuevosTurnos = JSON.parse(xhr.responseText); // Assuming JSON response
          actualizarTablaConNuevosDatos(nuevosTurnos.turnos);
          if (nuevosTurnos.turnos.length == 0 && nuevosTurnos.pendiente == false){

            var puesto = nuevosTurnos.puesto;
            var vg_arreglo = ["NA", puesto];
            const vg_arreglo_JSON = JSON.stringify(vg_arreglo)
            localStorage.setItem('turno', vg_arreglo_JSON);
            var turno_puesto = document.getElementById("turno_actual");
            turno_puesto.textContent = "NA";            
          };
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