$(document).ready(function() {
    var userIdToModificate; // Variable global para almacenar el ID del usuario a eliminar

    const puestos = {
        "Admin": ['Administracion'],
        "Recepcion": ['Recepcion'],
        "Ventanilla": ['Ventanilla1', 'Ventanilla2', 'Ventanilla3']
    };
  
    // Función para obtener opciones de puesto y actualizar el select
    const opciones_puesto = () => {
        var rol = document.getElementById("rol");
        var puesto = document.getElementById("puesto");
        puesto.innerHTML = '';

        var opciones = puestos[rol.value] || [];

        const placeholder_select = document.createElement('option');
        placeholder_select.textContent = "Seleccione un puesto";
        placeholder_select.value = " ";
        placeholder_select.hidden = true;
        placeholder_select.selected = true;
        placeholder_select.disabled = true;
        puesto.appendChild(placeholder_select);    

        opciones.forEach(opcion => {
            const option = document.createElement('option');
            option.textContent = opcion;
            option.value = opcion;
            puesto.appendChild(option);
        });
    };

    // Captura el cambio en el select "rol" para actualizar las opciones de "puesto"
    $('#rol').on('change', opciones_puesto);

    // Captura el clic en el botón dentro del modal y utiliza el ID del usuario
    $(document).on('click', '#ModificarUsuarioBtn', function() {
        userIdToModificate = $(this).data('user-id');
        console.log(userIdToModificate)
        // Aquí puedes hacer la llamada a tu API en Flask, pasando userIdToDelete como parámetro
        $.ajax({
            url: 'http://10.0.17.68:5000/user_alter/' + userIdToModificate,
            method: 'POST',
            success: function(response) {
                // Manejar la respuesta del servidor si es necesario
                console.log(response);
                location.reload(); // Recarga la página
            },
            error: function(error) {
                // Manejar errores si es necesario
                console.error(error);
                location.reload(); // Recarga la página
            }
        });
    });
});
