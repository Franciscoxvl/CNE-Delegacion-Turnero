$(document).ready(function() {

  var allData = null; // Variable global para almacenar los datos filtrados

  var dataTable = $('#dataTable').DataTable({
    columnDefs: [
      { type: 'date', targets: 4 } // Especificar el índice de la columna de fecha
    ],
    language: {
      lengthMenu: 'Turnos por pagina _MENU_  '.replace('_MENU_', '_MENU_ &nbsp;'),
      url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json' // Traducción al español
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
            xhr.open('GET', 'http://10.0.17.68:5000/api/generar_reporte', true);
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
