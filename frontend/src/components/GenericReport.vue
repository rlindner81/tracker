<script>
import { Line, mixins } from 'vue-chartjs'

const { reactiveData } = mixins

export default {
  name: 'ActivityChart',
  extends: Line,
  mixins: [reactiveData],
  props: {
    report: {
      type: Object,
      default: null
    }
  },
  data () {
    return {

    }
  },

  computed: {
    options () {
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: true,
              lineWidth: 1,
              color: '#2c3e5050'
            },
            ticks: {
              display: true
            },
            type: 'time',
            time: {
              unit: this.report ? this.report.interval.toLowerCase() : 'week'
            }
          }],
          yAxes: [{
            display: true
          }]
        }
      }
    }
  },

  mounted () {
    this.renderChart(this.chartdata, this.options)
  },

  watch: {
    report: {
      handler () {
        if (!this.report) {
          return null
        }

        this.chartData = {
          labels: [new Date(new Date().setMonth(0)), new Date(new Date().setMonth(1)), new Date(new Date().setMonth(2))],
          datasets: [
            {
              label: this.report ? this.report.name : 'Amount of Steps',
              backgroundColor: '#49D49D',
              data: [
                { t: new Date(new Date().setMonth(0)).toISOString(), y: 80 },
                { t: new Date(new Date().setMonth(1)).toISOString(), y: 79 },
                { t: new Date(new Date().setMonth(2)).toISOString(), y: 77 }
              ]
            }
          ]
        }
      },
      immediate: true
    }
  }
}
</script>
