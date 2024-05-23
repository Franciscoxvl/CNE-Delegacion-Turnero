$(document).ready(function() {
  var dataTable = $('#dataTable').DataTable({
      columnDefs: [
          { } 
      ],
      language: {
          url: 'static/vendor/Spanish.json'
      },
      paging: true,
      searching: true,
      ordering: true,
      info: false,
      processing: false,
      select: true,
      lengthChange: false
  });

  var userIdToDelete; 
  $('[id^=eliminar-usuario]').on('click', function(){
    userIdToDelete = $(this).data('user-id');
    console.log(userIdToDelete)
  });

  // Captura el clic en el botón dentro del modal y utiliza el ID del usuario
  $(document).on('click', '#eliminarUsuarioBtn', function() {
      // Aquí puedes hacer la llamada a tu API en Flask, pasando userIdToDelete como parámetro
      $.ajax({
          url: 'http://10.0.17.165/user_remove/' + userIdToDelete,
          method: 'DELETE',
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
