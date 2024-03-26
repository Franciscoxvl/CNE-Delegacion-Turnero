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
      url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json' 
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
    xhr.open('GET', 'http://10.0.17.68:5000/api/generar_reporte?fecha_inicio=&fecha_fin=', true);
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
    if (fecha_start == null || fecha_end.length == null || fecha_end.length == 0 || fecha_start == 0){
      alert("Debe ingresar un rango de fechas!")
      return;
    }
    xhr.open('GET', 'http://10.0.17.68:5000/api/generar_reporte?fecha_inicio=' + fecha_start + '&fecha_fin=' + fecha_end, true);
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
