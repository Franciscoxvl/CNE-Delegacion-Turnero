document.addEventListener('DOMContentLoaded', function() {
    var createButton = document.getElementById("user-create-form");
    var userInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");
    var nameInput = document.getElementById("nombre");
    var lastnameInput = document.getElementById("apellido");
    var rolInput = document.getElementById("rol");
    var servicioInput = document.getElementById("servicio");
    var puestoInput = document.getElementById("puesto");

    createButton.addEventListener('submit', (event) =>{
        user = userInput.value;
        password = passwordInput.value;
        nombre = nameInput.value;
        apellido = lastnameInput.value;
        rol = rolInput.value;
        puesto = puestoInput.value;
        servicio = servicioInput.value;

        console.log(user, password);

        if(user.length == 0 || password.length == 0 || nombre.length == 0 || apellido.length == 0 || rol.length == 0 || puesto.length == 0 ){
            event.preventDefault();    
            alert("Todos los campos deben estar llenos")   
        }
    });

    const puestos = {
        "Admin": ['Administracion'],
        "Recepcion": ['Recepcion'],
        "Ventanilla": ['Recaudaciones', 'Cambios de domicilio', 'Justificaciones']
    };

    const opciones_puesto = () =>{
        var rol = document.getElementById("rol");
        var servicio = document.getElementById("servicio");
        servicio.innerHTML = '';

        var opciones = puestos[rol.value] || [];

        const placeholder_select = document.createElement('option');
        placeholder_select.textContent = "Seleccione un servicio";
        placeholder_select.value = " ";
        placeholder_select.hidden = true;
        placeholder_select.selected = true;
        placeholder_select.disabled = true;
        servicio.appendChild(placeholder_select);    

        opciones.forEach(opcion => {
            const option = document.createElement('option');
            option.textContent = opcion;
            option.value = opcion;
            servicio.appendChild(option);
        });

    };

    rol.addEventListener('change', opciones_puesto);
});
