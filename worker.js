addEventListener('message', (event) => {
    const htmlTurno = event.data; // Recibir el HTML formateado del turno
  
    // Crear un objeto Document para cargar el HTML
    const printDocument = new Document();
    printDocument.documentElement.innerHTML = htmlTurno;
  
    // Ejecutar el comando de impresión
    try {
      printDocument.execCommand('print');
    } catch (error) {
      console.error('Error al imprimir:', error);
    }
  });
  