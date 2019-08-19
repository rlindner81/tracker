import axios from 'axios'

export default {
  namespaced: true,
  state: {
    data: [],
    trackId: null,
    new: {
      name: null,
      interval: null,
      aggregations: []
    },
    intervals: ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'],
    aggregations: ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX']
  },
  mutations: {
    set (state, data) {
      state.data = data
    },
    setTrack (state, id) {
      state.trackId = id
    },
    clear (state) {
      state.data = null
      state.trackId = null
      state.new = null
    },
    clearNew (state) {
      state.new = {
        name: null,
        interval: null,
        aggregations: []
      }
    },
    add (state, data) {
      state.data.unshift(data)
    },
    remove (state, id) {
      state.data = state.data.filter(report => {
        return report._id !== id
      })
    }
  },
  actions: {
    load ({ commit, state, rootGetters }) {
      commit('setTrack', rootGetters['track/current']._id)
      return axios.get(`/api/track/${state.trackId}/report`)
        .then(response => {
          commit('set', response.data)
        })
    },
    create ({ commit, state, rootGetters }) {
      return axios.post(`/api/track/${rootGetters['track/current']._id}/report`, state.new)
        .then(response => {
          commit('clearNew')
          commit('add', response.data)
        })
    }
  }
}
