<script>
import { mapState } from 'vuex'
import { Bar, mixins } from 'vue-chartjs'
const { reactiveData } = mixins
export default {
  name: 'ActivityChart',
  extends: Bar,
  mixins: [reactiveData],
  data () {
    return {
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
    }
  },

  mounted () {
    this.renderChart(this.chartdata, this.options)
  },

  watch: {
    report: {
      handler () {
        this.chartData = {
          labels: !this.report ? [] : this.report.map(entry => { return entry.startAt }),
          datasets: [
            {
              label: 'Amount of Steps',
              backgroundColor: '#49D49D',
              data: !this.report ? [] : this.report.map(entry => { return entry.count })
            }
          ]
        }
      },
      immediate: true
    }
  },

  computed: {
    ...mapState('track', { report: 'currentUsage' })
  }
}
</script>
