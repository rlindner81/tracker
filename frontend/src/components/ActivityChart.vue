<script>
import { Bar } from 'vue-chartjs'

export default {
  name: 'ActivityChart',
  extends: Bar,
  data: () => ({
    chartdata: {
      labels: ['01.08.2019', '02.08.2019', '03.08.2019', '04.08.2019', '05.08.2019', '06.08.2019', '07.08.2019', '08.08.2019', '09.08.2019', '10.08.2019', '11.08.2019', '12.08.2019', '13.08.2019', '14.08.2019', '15.08.2019', '16.08.2019', '17.08.2019', '18.08.2019'],
      datasets: [
        {
          label: 'Amount of Steps',
          backgroundColor: '#49D49D',
          data: [1, 0, 1, 2, 1, 1, 1, 3, 1, 0, 1, 1, 1, 2, 1, 3, 1, 0]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
            lineWidth: 1,
            color: '#2c3e5050'
          },
          ticks: {
            display: false
          }
        }],
        yAxes: [{
          display: false
        }]
      }
    }
  }),

  mounted () {
    this.renderChart(this.chartdata, this.options)
  }
}
</script>
