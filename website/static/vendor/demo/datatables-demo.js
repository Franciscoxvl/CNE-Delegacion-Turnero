$(document).ready(function() {
  var dataTable = $('#dataTable').DataTable({
    columnDefs: [
      { type: 'date', targets: 4 } // Especificar el índice de la columna de fecha
    ],
    language: {
      url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json' // Traducción al español
    },
    paging: true,
    searching: true,
    ordering: true,
    info: true,
    lengthMenu: [10, 25, 50, 100],
    processing: true,
    select: true
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

  // Eliminar evento draw (opcional, no es necesario para filtrar)
  // dataTable.on('draw', function() {
  //   filteredData = dataTable.rows({ search: 'applied' }).data().toArray();
  //   console.log(filteredData);
  // });
});
