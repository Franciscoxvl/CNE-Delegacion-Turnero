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
    const checkedbox = document.getElementById("preferencial");
    const preferencial = checkedbox.checked ? true : false;

    const url = new URL('http://10.0.17.68:5000/api/generar_turno_espera');
    url.searchParams.append('servicio', servicio);
    url.searchParams.append('preferencial', preferencial);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(response)
            throw new Error('Error en la solicitud');
        }

        const data = await response.text();
        checkedbox.checked = false;
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

        switch (kind_message){

            case 'cambios_domicilio':
    
                fetch("../static/messages/cambios_domicilio.html")
                .then(response => response.text())
                .then(html => {

                    main_container.style.width ="0%";
                    main_container.style.margin = "0";
                    div_requirements.style.width = "90%";
                    
                    if(window.innerHeight < 768){
                        div_requirements.style.height = "69%";
                    }else{
                        div_requirements.style.height = "55%";
                    };

                    div_requirements.innerHTML = html;

                    
                })
                .catch(error => console.error('Error al cargar el contenido:', error));
                break;
            
            case 'justificaciones':
    
                fetch("../static/messages/justificaciones.html")
                .then(response => response.text())
                .then(html => {
                    // Actualiza el contenido del div con el contenido importado
                    
                    main_container.style.width ="0%";
                    main_container.style.margin = "0";
                    div_requirements.style.width = "80%";
                    div_requirements.innerHTML = html;
                    let boton = document.getElementById("contenedor-btn-mensajes")
                    if(window.innerHeight < 768){
                        div_requirements.style.height = "80%";
                    }else{
                        div_requirements.style.height = "75%";
                    };
                    
                    boton.style.marginTop = "4rem";

                })
                .catch(error => console.error('Error al cargar el contenido:', error));
                break;
    
            case 'certificados_votacion':
    
                fetch("../static/messages/certificados_votacion.html")
                .then(response => response.text())
                .then(html => {
                    // Actualiza el contenido del div con el contenido importado
                    main_container.style.width ="0%";
                    main_container.style.margin = "0";
                    div_requirements.style.width = "90%";
                    div_requirements.style.height = "90%";
                    if(window.innerHeight < 768){
                        div_requirements.style.fontSize = "1.7rem";
                    }else{
                        div_requirements.style.fontSize = "2.3rem";
                    };
                    
                    div_requirements.style.padding = "3rem";

                    div_requirements.innerHTML = html;
                })
                .catch(error => console.error('Error al cargar el contenido:', error));
                break;
            
            case 'desafiliaciones':
    
                fetch("../static/messages/desafiliaciones.html")
                .then(response => response.text())
                .then(html => {
                    // Actualiza el contenido del div con el contenido importado

                    main_container.style.width ="0%";
                    main_container.style.margin = "0";
                    div_requirements.style.width = "90%";
                    div_requirements.innerHTML = html;
                    let boton = document.getElementById("contenedor-btn-mensajes")

                    if(window.innerHeight < 768){
                        div_requirements.style.height = "70%";
                    }else{
                        div_requirements.style.height = "58%";
                   
                    };
                    
                    
                })
                .catch(error => console.error('Error al cargar el contenido:', error));
                break;
    
            case 'online':
    
                fetch("../static/messages/online.html")
                .then(response => response.text())
                .then(html => {
                    // Actualiza el contenido del div con el contenido importado

                    main_container.style.width ="0%";
                    main_container.style.margin = "0";
                    div_requirements.style.width = "90%";
                    div_requirements.innerHTML = html;
                    let boton = document.getElementById("contenedor-btn-mensajes")

                    if(window.innerHeight < 768){
                        div_requirements.style.height = "80%";
                    }else{
                        div_requirements.style.height = "58%";
                   
                    };
                    
                    boton.style.marginTop = "6rem";

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
        main_container.style.width ="100%";
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
            
            let p_resultado = document.getElementById('resultado');
            p_resultado.innerHTML = turno;

            if(window.innerHeight < 768){
                div_requirements.style.width = "40%";
                div_requirements.style.height = "55%"
            }else{
                div_requirements.style.width = "50%";
                div_requirements.style.height = "40%"
            };

            // Calcula el ancho del texto en el párrafo
            let textWidth = p_resultado.offsetWidth;

            // Establece el ancho del fondo blanco basado en el ancho del texto
            p_resultado.style.width = textWidth*2.5 + 'px'; // Establece el ancho del párrafo

        }).then(()=>{
            div_requirements.style.opacity = "1";

            setTimeout(()=>{
                volver_inicio();
            }, 2500, turno)
            
        })
        .catch(error => console.error('Error al cargar el contenido:', error));       
    }, 1000);
    
};

const salir = ()  => {
    // Redirecciona a la URL deseada
    window.location.href = "http://10.0.17.68:5000/logout";
};



