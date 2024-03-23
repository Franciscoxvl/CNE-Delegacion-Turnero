$(document).ready(function() {
  
    var userIdToModificate; // Variable global para almacenar el ID del usuario a eliminar
  
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
  