// Modificar la función generar_turno para que sea asíncrona
const generar_turno = async (tipo, servicio) => {
    try {
        const resultado = await obtener_turno(servicio);
        console.log(resultado);
        turno_assignado_mensaje(resultado);
    } catch (error) {
        console.error('Error en generar_turno:', error);
    }
};

const obtener_turno = async (servicio) => {
    const url = new URL('http://10.0.17.68:5000/api/generar_turno_espera');
    url.searchParams.append('servicio', servicio);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const data = await response.text();
        return data;

    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
        throw error; // Propagar el error
    }
};

const show_message = (kind_message) => {

    let main_container = document.getElementById("main-container");
    
    let div_requirements = document.getElementById("requirements");
    main_container.style.opacity = "0";

    setTimeout(()=>{

        let main_child_div = main_container.querySelectorAll("div");

        main_child_div.forEach((main_div)=>{
            main_div.style.pointerEvents = "none";
        });

        main_container.style.width ="0%";
        main_container.style.margin = "0";
        div_requirements.style.width = "90%";
        div_requirements.style.height = "auto";

        switch (kind_message){

            case 'cambios_domicilio':
    
                fetch("../static/messages/cambios_domicilio.html")
                .then(response => response.text())
                .then(html => {
                    // Actualiza el contenido del div con el contenido importado
                    div_requirements.innerHTML = html;
                })
                .catch(error => console.error('Error al cargar el contenido:', error));
                break;
            
            case 'justificaciones':
    
                fetch("../static/messages/justificaciones.html")
                .then(response => response.text())
                .then(html => {
                    // Actualiza el contenido del div con el contenido importado
                    div_requirements.innerHTML = html;
                })
                .catch(error => console.error('Error al cargar el contenido:', error));
                break;
    
            case 'certificados_votacion':
    
                fetch("../static/messages/certificados_votacion.html")
                .then(response => response.text())
                .then(html => {
                    // Actualiza el contenido del div con el contenido importado
                    div_requirements.innerHTML = html;
                })
                .catch(error => console.error('Error al cargar el contenido:', error));
                break;
            
            case 'desafiliaciones':
    
                fetch("../static/messages/desafiliaciones.html")
                .then(response => response.text())
                .then(html => {
                    // Actualiza el contenido del div con el contenido importado
                    div_requirements.innerHTML = html;
                })
                .catch(error => console.error('Error al cargar el contenido:', error));
                break;
    
            case 'online':
    
                fetch("../static/messages/online.html")
                .then(response => response.text())
                .then(html => {
                    // Actualiza el contenido del div con el contenido importado
                    div_requirements.innerHTML = html;
                })
                .catch(error => console.error('Error al cargar el contenido:', error));
                break;
            
            default:
                console.log("Opcion no reconocida!");
        };
        div_requirements.style.opacity = "1";
    },1000);    
};

const volver_inicio = () =>{
    let main_container = document.getElementById("main-container");
    let div_requirements = document.getElementById("requirements");
    
    div_requirements.style.opacity = "0";

    let main_child_div = main_container.querySelectorAll("div");

    main_child_div.forEach((main_div)=>{
        main_div.style.pointerEvents = "auto";
    });

    setTimeout(()=>{
        div_requirements.style.width = "0%";
        main_container.style.width ="auto";
        main_container.style.margin = "0 auto";
        main_container.style.opacity = "1";

    }, 1000);
};

const turno_assignado_mensaje = (turno) => {
    let div_requirements = document.getElementById("requirements");
    div_requirements.style.opacity = "0";

    setTimeout(() => {
        fetch("../static/messages/turno_asignado.html")
        .then(response => response.text())
        .then(html => {
            // Actualiza el contenido del div con el contenido importado
            div_requirements.innerHTML = html;
            div_requirements.style.width = "auto";
            document.getElementById('resultado').innerHTML = turno;

        }).then(()=>{
            div_requirements.style.opacity = "1";

            setTimeout(()=>{
                volver_inicio();
            }, 3000, turno)
            
        })
        .catch(error => console.error('Error al cargar el contenido:', error));       
    }, 1000);
    
};



