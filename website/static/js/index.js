const socket = io.connect('http://10.0.17.165');
let contador = 0;
let mensaje = "";

function colocar_turno(turno, puesto) {
    contador += 1 ;
    const container = document.querySelector('.solo-turnos');
    let puesto_var = puesto.slice(0, 3)
    let numero_puesto = puesto.slice(3)
    let puesto_nombre = ""
    let puesto_final = ""
    let puesto_decir = ""
    let puesto_decir_final = ""
    
    if (puesto_var == "VCD"){
        puesto_nombre = "Cambios";
        puesto_decir = "Cambios"
    } else if (puesto_var == "VJF"){
        puesto_decir = "Justificasiones"
        puesto_nombre = puesto_decir.slice(0,6)

    } else {
        puesto_nombre = "Cajas"
        puesto_decir = "Cajas"
    }

    puesto_final = puesto_nombre + numero_puesto
    puesto_decir_final = puesto_decir + numero_puesto


    if (contador <=5){
        
        const turno_hijo = document.createElement('div');
        turno_hijo.classList.add('content-table');
        turno_hijo.innerHTML = `
            <p>${turno}</p>
            <span class="arrow">&rarr;</span>
            <p>${puesto_final}</p>
        `;

        turno_hijo.style.transform = 'translateY(-60px)';
        turno_hijo.style.opacity = 0;

        setTimeout(() => {

            if (contador == 1){
                container.appendChild(turno_hijo);
            }else{
                const primero = container.firstChild;
                container.insertBefore(turno_hijo, primero);
            }
    
            // Fuerza un reflow para aplicar las transiciones
            container.offsetHeight;

            mensaje = `Turno ${turno} pasar al módulo ${puesto_decir_final} `;
            decirMensaje(mensaje);
    
            const turnos = document.querySelectorAll('.content-table');
    
            turnos.forEach(turno => {
                    turno.style.transform = 'translateY(0)';
                    turno.style.opacity = 1;
            });
        }, 800);

    } else {

        const primero = container.firstChild;
  
        // Obtener el último cuadrado
        const ultimo = container.lastElementChild;
  
        // Verificar que haya al menos un cuadrado para eliminar
        if (ultimo) {
         // Aplicar la animación de desvanecimiento y desplazamiento hacia abajo
  
        ultimo.style.transform = 'translateY(50px)';
        ultimo.style.opacity = 0;
        
    
        // Crear un nuevo cuadrado
        const nuevo = document.querySelector('.content-table');
        const nuevoDiv = nuevo.cloneNode(true);
        var contenido = nuevoDiv.querySelectorAll('p');
        var codigo = contenido[0];
        var puesto_turno= contenido[1];
        codigo.innerHTML = turno;
        puesto_turno.innerHTML = puesto_final;
        nuevoDiv.style.transform = 'translateY(-60px)';
        nuevoDiv.style.opacity = 0;
    
        // Esperar la duración de la animación (en este caso, 0.5s) antes de eliminar el cuadrado
        setTimeout(() => {
    
            ultimo.remove();  
    
            // Añadir el nuevo cuadrado al principio
            container.insertBefore(nuevoDiv, primero);
    
            // Fuerza un reflow para aplicar las transiciones
            container.offsetHeight;

            let mensaje = `Turno ${turno} pasar al módulo ${puesto_decir_final} `;
            decirMensaje(mensaje);
    
            const turnos = document.querySelectorAll('.content-table');
    
            turnos.forEach(turno => {
                    turno.style.transform = 'translateY(0)';
                    turno.style.opacity = 1;
            });
        }, 800); 
        }

    }
    
    
  }

// Escucha eventos del backend con datos continuamente
let colocarTurnoActiva = false;

socket.on('turno_asignado', (data) => {
    if (!colocarTurnoActiva) {
        colocarTurnoActiva = true;

        var codigo = data.codigo;
        var numero_turno = data.numero_turno;
        var turno = codigo + numero_turno;
        var puesto = data.puesto;

        if(turno == "NA"){
            console.log("No hay turnos pendientes")
        } else {
            colocar_turno(turno, puesto);
        }

        setTimeout(() => {
            colocarTurnoActiva = false;
        }, 1010);

    } else {
        console.log("Esperando....")
    }
});

socket.on('repetir_mensaje_vi', () => {
    decirMensaje(mensaje);
});

socket.on('reproducir_contenido', (data) => {

    let player = document.getElementById('visualizador');

    
    player.pause();
    player.currentTime = 0;
    let currentIndex = 0;

    const playNextVideo = () => {
        if (currentIndex < data.filePaths.length) {
            console.log(data.filePaths[currentIndex])
            console.log("Entrando")
            player.src = data.filePaths[currentIndex];
            player.play();
            currentIndex++;
        } else {
            currentIndex = 0;
            playNextVideo();
        }
    };

    player.onended = playNextVideo;
    playNextVideo()
});

// Maneja cualquier error de conexión
socket.on('connect_error', (error) => {
    console.error('Error de conexión:', error.message);
});

// Maneja la desconexión del servidor
socket.on('disconnect', () => {
    console.warn('Desconectado del servidor');
});

function clock() {
    const $ = (id) => {
        return document.getElementById(id);
    };
    const $hours = $('hours');
    const $minutes = $('minutes');
    const $seconds = $('seconds');
    const $ampm = $('ampm');
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    if (hours > 12) {
        hours = hours - 12;
    }

    const updateValue = ($ele, value)=>{
        $ele.innerHTML = String(value).padStart(2, '0');
    }

    updateValue($hours, hours);
    updateValue($minutes, minutes);
    updateValue($seconds, seconds);
    updateValue($ampm, ampm);

}

setInterval(clock, 1000);

function decirMensaje(mensaje) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(mensaje);

    // Obtener todas las voces disponibles
    const vocesDisponibles = synth.getVoices();

    // Filtrar las voces para excluir las voces de España (es-ES) y las de Estados Unidos (es-US)
    const vocesParaLatinoamerica = vocesDisponibles.filter(voice => voice.lang.startsWith('es') && voice.lang !== 'es-US');
    const vozElegida = vocesParaLatinoamerica.length > 0 ? vocesParaLatinoamerica[2] : null;

    if (vozElegida) {
        utterance.voice = vozElegida;
        utterance.lang = vozElegida.lang; // Establecer el idioma de la voz elegida
        utterance.rate = 0.75; // Ajustar la rapidez según lo requerido
        synth.speak(utterance);
    } else {
        console.error('No se encontró una voz en español latinoamericano.');
    }
}


// Esperar a que las voces estén disponibles antes de llamar a la función
window.speechSynthesis.onvoiceschanged = () => {
    // Llamar a la función con el mensaje que deseas decir
    decirMensaje('Bienvenidos a la Delegación Provincial de Pichincha');
};

