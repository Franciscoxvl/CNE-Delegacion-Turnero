document.addEventListener("DOMContentLoaded", function () {
  // Pie Chart Example
  var ctx = document.getElementById("myPieChart").getContext('2d');
  var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: ["Direct", "Referral", "Social"],
          datasets: [{
              data: [55, 30, 15],
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
          scales: {
              x: {
                  display: false
              },
              y: {
                  display: false
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
});
