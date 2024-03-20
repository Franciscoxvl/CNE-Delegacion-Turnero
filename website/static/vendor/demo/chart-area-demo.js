document.addEventListener("DOMContentLoaded", function () {
    // Espera a que se cargue el DOM

    // Función para obtener los datos y dibujar el gráfico
    function obtenerDatosYDibujarGrafico() {
        // Iniciar solicitud fetch para obtener los datos
        fetch('http://10.0.17.68:5000/api/datos_diarios')
        .then(response => {
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            // Convertir la respuesta a JSON
            return response.json();
        })
        .then(data => {
            // Los datos están disponibles aquí
            // Imprimir los datos en la consola para verificar
            console.log(data);
            
            // Configurar el gráfico utilizando los datos
            var ctx = document.getElementById('myAreaChart').getContext('2d');
            var myLineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ["Lun", "Mar", "Mier", "Jue", "Vie"],
                    datasets: [{
                        label: "Turnos",
                        data: data,
                        backgroundColor: "rgba(78, 115, 223, 0.05)",
                        borderColor: "rgba(78, 115, 223, 1)",
                        pointRadius: 3,
                        pointBackgroundColor: "rgba(78, 115, 223, 1)",
                        pointBorderColor: "rgba(78, 115, 223, 1)",
                        pointHoverRadius: 3,
                        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                        pointHitRadius: 10,
                        pointBorderWidth: 2,
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    aspectRatio: false,
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            ticks: {
                                callback: function (value, index, values) {
                                    return Number.isInteger(value) ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
                                }
                            },
                            grid: {
                                color: "rgb(234, 236, 244)",
                                zeroLineColor: "rgb(234, 236, 244)",
                                drawBorder: false,
                                borderDash: [2],
                            }
                        }
                    }
                }
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
