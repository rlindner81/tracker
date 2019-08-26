import axios from 'axios'

export default {
  namespaced: true,
  state: {
    data: [],
    currentId: null,
    currentUsage: [],
    new: {
      name: null,
      fields: []
    },
    newStep: null, // has to be initialized by the relevant track
    types: ['TEXT', 'FLOAT', 'INTEGER', 'TIME'],
    inputs: ['SELECT', 'FIELD', 'SLIDER']
  },
  mutations: {
    set (state, data) {
      state.data = data
    },
    setCurrent (state, id) {
      state.currentId = id
    },
    setCurrentUsage (state, data) {
      state.currentUsage = data
    },
    clear (state) {
      state.data = null
    },
    clearNew (state) {
      state.new = {
        name: null,
        fields: []
      }
    },
    clearCurrent (state) {
      state.currentId = null
      state.currentUsage = []
    },
    add (state, data) {
      state.data.push(data)
    },
    remove (state, id) {
      state.data = state.data.filter(track => {
        return track._id !== id
      })
    }
  },
  getters: {
    titleById: state => id => {
      let entry = state.data.find(entry => entry._id === id)
      return entry ? entry.name : null
    },
    current (state) {
      return state.data.find(track => track._id === state.currentId)
    }
  },
  actions: {
    load ({ commit }) {
      return axios.get('/api/track')
        .then(response => {
          commit('set', response.data)
        })
    },
    create ({ commit, state }) {
      return axios.post('/api/track', state.new)
        .then(response => {
          let track = response.data
          track.stepCount = 0
          commit('add', track)
          commit('clearNew')
        })
    },
    update ({ getters }) {
      let patchable = JSON.parse(JSON.stringify(getters.current))
      delete patchable._id
      delete patchable.userId
      delete patchable.createdAt
      delete patchable.updatedAt
      delete patchable.stepCount
      return axios.patch(`/api/track/${getters.current._id}`, patchable)
    },
    delete ({ commit, getters }) {
      return axios.delete(`/api/track/${getters.current._id}`)
        .then(response => {
          let id = getters.current._id
          commit('clearCurrent')
          commit('remove', id)
        })
    },
    report ({ commit, getters }) {
      return axios.post(`/api/track/${getters.current._id}/report/$dynamic`, {
        aggregations: [{ key: 'count', type: 'COUNT' }],
        interval: 'DAY'
      }).then(response => {
        commit('setCurrentUsage', response.data.aggregations)
      })
    }
  }
}
