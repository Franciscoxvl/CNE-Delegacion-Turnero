document.addEventListener("DOMContentLoaded", function () {
    // Función para obtener los datos y dibujar el gráfico
    function obtenerDatosYDibujarGrafico() {
        // Iniciar solicitud fetch para obtener los datos
        fetch('http://10.0.17.68:5000/api/datos_puestos')
        .then(response => {
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            // Convertir la respuesta a JSON
            return response.json();
        })
        .then(data => {
            // Configurar el gráfico utilizando los datos
            var ctx = document.getElementById("myPieChart").getContext('2d');
            var myPieChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ["Ventanilla 1", "Ventanilla 2", "Ventanilla 3"],
                    datasets: [{
                        data: data,
                        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
                        hoverBorderColor: "rgba(234, 236, 244, 1)",
                    }],
                },
                options: {
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    cutout: 80,
                    aspectRatio: false,
                    layout: {
                        padding: {
                            left: 10,
                            right: 25,
                            top: 25,
                            bottom: 0
                        }
                    },
                    tooltips: {
                        backgroundColor: "rgb(255,255,255)",
                        bodyFontColor: "#858796",
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        padding: 15,
                        displayColors: false,
                        caretPadding: 10,
                    },
                },
            });
        })
        .catch(error => {
            // Manejar errores en la solicitud fetch
            console.error('Error al obtener los datos:', error);
        });
    }

    // Llamar a la función para obtener datos y dibujar el gráfico
    obtenerDatosYDibujarGrafico();
});
