<script>
import { Line, mixins } from 'vue-chartjs'

import axios from 'axios'
import moment from 'moment'

import { mapGetters } from 'vuex'

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

  computed: {
    ...mapGetters('track', { track: 'current' }),
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
              return moment(result.startAt).utc()
            })

            datasets = this.report.aggregations.map(aggregation => {
              let field = this.track.fields.find(field => field.key === aggregation.field)
              let name = `${aggregation.type} ${field ? field.name : aggregation.field}`
              return {
                label: this.report ? name : 'Amount of Steps',
                backgroundColor: '#49D49D',
                data: response.data.aggregations.map(result => {
                  return {
                    t: moment(result.startAt).utc(),
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
