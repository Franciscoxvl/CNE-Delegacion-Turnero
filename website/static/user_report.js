$(document).ready(function() {

  var allData = null;
  var fecha_start = null;
  var fecha_end = null; 

  // Add event listener to the generate report button
  $('#botonReportesG').click(function() {
    var xhr = new XMLHttpRequest();
    var rol = $('#rol').val();
    var id_user = $('#id_user').val();

    xhr.open('GET', 'http://10.0.17.68:5000/api/generar_reporte_usuario?fecha_inicio=&fecha_fin=&rol=' + rol, true);
    xhr.responseType = 'blob'; // Indica que esperamos una respuesta de tipo blob (archivo)
    xhr.onload = function() {
      if (xhr.status === 200) {
        var blob = xhr.response;
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'reporte.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

    if (fecha_start == null || fecha_end.length == null || fecha_end.length == 0 || fecha_start == 0){
      
      alert("Debe ingresar un rango de fechas!")
      return;
    }
    

    xhr.open('GET', 'http://10.0.17.68:5000/api/generar_reporte_usuario?fecha_inicio=' + fecha_start + '&fecha_fin=' + fecha_end + '&rol=' + rol, true);
    xhr.responseType = 'blob'; // Indica que esperamos una respuesta de tipo blob (archivo)
    xhr.onload = function() {
      if (xhr.status === 200) {
        var blob = xhr.response;
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'reporte.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Error al generar el reporte.');
      }
    };
    xhr.send();
  });

});
