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
    types: ['TEXT', 'NUMBER', 'SELECT_SINGLE', 'TIME']
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
    },
    addField (state) {
      state.new.fields.push({
        position: state.new.fields.length,
        key: null,
        name: null,
        input: true,
        type: {
          identifier: 'TEXT',
          parameters: {
            selected: null,
            values: []
          }
        },
        generator: {
          identifier: 'STATIC',
          parameters: {
            value: null
          }
        }
      })
    },
    removeField (state, index) {
      state.new.fields.splice(index, 1)
    }
  },
  getters: {
    titleById: state => id => {
      let entry = state.data.find(entry => entry._id === parseInt(id))
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
        })
    },
    delete ({ commit, getters }) {
      return axios.delete(`/api/track/${getters.current._id}`)
        .then(response => {
          commit('remove', getters.current._id)
        })
    },
    report ({ commit, getters }) {
      return axios.post(`/api/track/${getters.current._id}/report`, {
        aggregations: [{ key: 'count', type: 'COUNT' }],
        interval: 'DAY'
      }).then(response => {
        commit('setCurrentUsage', response.data.aggregations)
      })
    }
  }
}