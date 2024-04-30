$(document).ready(function() {

  var allData = null;
  var fecha_start = null;
  var fecha_end = null; 

  // Add event listener to the generate report button
  $('#botonReportesG').click(function() {
    console.log("probando")
    var xhr = new XMLHttpRequest();
    var rol = $('#rol').val();
    var id_user = $('#id_user').val();
    var mensaje = document.getElementById("mensaje_cargando")

    mensaje.style.display = "block";
    xhr.open('GET', 'http://10.0.17.52/api/generar_reporte_usuario?fecha_inicio=&fecha_fin=&rol=' + rol + '&id_user=' + id_user, true);
    xhr.responseType = 'blob'; // Indica que esperamos una respuesta de tipo blob (archivo)
    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log(xhr.response)
        var iframe = document.getElementById('pdfViewer'); // Reemplaza 'pdfViewer' con el ID de tu iframe

        // Obtener la URL actual del iframe
        var currentUrl = iframe.src;
        // Forzar la recarga del iframe
        iframe.src = ''; // Vaciar la URL
        iframe.src = currentUrl; // Volver a cargar la misma URL
        mensaje.style.display = "none";
      } else {
        alert('Error al generar el reporte.');
      }
    };
    xhr.send();
  });
  

  $('#botonReportesP').click(function() {
    var xhr = new XMLHttpRequest();
    fecha_start = $('#fechaInicio').val();
    fecha_end = $('#fechaFin').val();
    var rol = $('#rol').val();
    var id_user = $('#id_user').val();
    var mensaje = document.getElementById("mensaje_cargando")

    if (fecha_start == null || fecha_end.length == null || fecha_end.length == 0 || fecha_start == 0){
      
      alert("Debe ingresar un rango de fechas!")
      return;
    }

    mensaje.style.display = "block";
    xhr.open('GET', 'http://10.0.17.52/api/generar_reporte_usuario?fecha_inicio=' + fecha_start + '&fecha_fin=' + fecha_end + '&rol=' + rol + '&id_user=' + id_user, true);
    xhr.responseType = 'blob'; // Indica que esperamos una respuesta de tipo blob (archivo)
    xhr.onload = function() {
      if (xhr.status === 200) {
        var iframe = document.getElementById('pdfViewer'); // Reemplaza 'pdfViewer' con el ID de tu iframe

        // Obtener la URL actual del iframe
        var currentUrl = iframe.src;

        // Forzar la recarga del iframe
        iframe.src = ''; // Vaciar la URL
        iframe.src = currentUrl; // Volver a cargar la misma URL
        mensaje.style.display = "none";
      } else {
        alert('Error al generar el reporte.');
      }
    };
    xhr.send();
  });

});
