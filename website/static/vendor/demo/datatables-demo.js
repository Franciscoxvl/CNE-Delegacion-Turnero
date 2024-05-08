$(document).ready(function() {

  var allData = null;
  var fecha_start = null;
  var fecha_end = null; 

  var dataTable = $('#dataTable').DataTable({
    columnDefs: [
      { type: 'date', targets: 4 } 
    ],
    language: {
      lengthMenu: 'Turnos por pagina _MENU_  '.replace('_MENU_', '_MENU_ &nbsp;'),
      url: 'static/vendor/Spanish.json' 
    },
    paging: true,
    searching: true,
    ordering: true,
    info: true,
    lengthMenu: [10, 25, 50, 100],
    processing: false,
    select: true
  });


  // Add event listener to the generate report button
  $('#botonReportesG').click(function() {
    var xhr = new XMLHttpRequest();
    var mensaje = document.getElementById("mensaje_cargando")
    mensaje.style.display = "block";
    xhr.open('GET', 'http://10.0.17.165/api/generar_reporte?fecha_inicio=&fecha_fin=', true);
    xhr.responseType = 'blob'; 
    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log(xhr.response)
        var iframe = document.getElementById('pdfViewer'); 

        // Obtener la URL actual del iframe
        var currentUrl = iframe.src;
        // Forzar la recarga del iframe
        iframe.src = ''; // Vaciar la URL
        iframe.src = currentUrl; // Volver a cargar la misma URL
        mensaje.style.display = "none";

      } else {
        alert('Error al generar el reporte.');
        console.log(xhr.responseText)
      }
    };
    xhr.send();
  });

  $('#botonReportesP').click(function() {
    var xhr = new XMLHttpRequest();
    var mensaje = document.getElementById("mensaje_cargando")
    if (fecha_start == null || fecha_end.length == null || fecha_end.length == 0 || fecha_start == 0){
      alert("Debe ingresar un rango de fechas!")
      return;
    }
    mensaje.style.display = "block";
    xhr.open('GET', 'http://10.0.17.165/api/generar_reporte?fecha_inicio=' + fecha_start + '&fecha_fin=' + fecha_end, true);
    xhr.responseType = 'blob';
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
        console.log(xhr.responseText)
      }
    };
    xhr.send();
  });

 

  function filterByDateRange() {
    $.fn.dataTable.ext.search.push(
      function(settings, data, dataIndex) {
        var date = data[4]; // Especificar el índice de la columna de fecha
        var startDate = $('#fechaInicio').val();
        var endDate = $('#fechaFin').val();
        fecha_end = endDate;
        fecha_start = startDate;

        if (startDate && endDate) {
          return (date >= startDate && date <= endDate);
        } else {
          return true; // Mostrar todos los datos si no hay fechas seleccionadas
        }
      }
    );

    // Volver a dibujar la tabla con los datos filtrados
    dataTable.draw();
  }

  // Evento de clic en el botón para aplicar el filtro
  $('#botonFiltrar').click(function() {
    filterByDateRange();
  });

  //Eliminar evento draw (opcional, no es necesario para filtrar)
  dataTable.on('draw', function() {
    allData = dataTable.rows().data().toArray();
  });

});
