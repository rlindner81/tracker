<script>
import { Line, mixins } from 'vue-chartjs'

import axios from 'axios'
import momemt from 'moment'

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
            display: true,
            ticks: {
              beginAtZero: true
            }
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

        let datasets = []
        let labels = []

        axios.get(`/api/track/${this.report.trackId}/report/${this.report._id}/$evaluate`)
          .then(response => {
            labels = response.data.aggregations.map(result => {
              return momemt(result.startAt).utc()
            })
            datasets = this.report.aggregations.map(aggregation => {
              return {
                label: this.report ? this.report.name : 'Amount of Steps',
                backgroundColor: '#49D49D',
                data: response.data.aggregations.map(result => {
                  return {
                    t: momemt(result.startAt).utc(),
                    y: result[aggregation.key]
                  }
                })
              }
            })

            this.chartData = {
              labels,
              datasets
            }
          })
      },
      immediate: true
    }
  }
}
</script>
