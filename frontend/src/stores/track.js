import axios from 'axios'

export default {
  namespaced: true,
  state: {
    data: [],
    currentId: null,
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
    setCurrent (state, data) {
      state.currentId = data._id
    },
    clear (state) {
      state.data = null
    },
    clearCurrent (state) {
      state.currentId = null
      state.newStep = null
    },
    resetNewStep (state, track) {
      let newStep = {}

      track.fields.forEach(field => {
        newStep[field.key] = null
      })
      state.newStep = newStep
    },
    add (state, data) {
      state.data.push(data)
    },
    addStep (state, data) {
      state.data.find(track => track._id === state.currentId).steps.unshift(data)
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
          commit('set', response.data.map(track => {
            track.steps = []
            return track
          }))
        })
    },
    getSteps ({ commit, state }, id) {
      commit('clearCurrent')
      return axios.get(`/api/track/${id}/step`)
        .then(response => {
          let current = state.data.find(track => track._id === id)
          current.steps = response.data
          commit('resetNewStep', current)
          commit('setCurrent', current)
        })
    },
    create ({ commit, state }) {
      return axios.post('/api/track', state.new)
        .then(response => {
          commit('add', response.data)
        })
    },
    delete ({ commit, getters }) {
      return axios.delete(`/api/track/${getters.current._id}`)
        .then(response => {
          commit('remove', getters.current._id)
        })
    },
    addStep ({ commit, state, getters }) {
      return axios.post(`/api/track/${getters.current._id}/step`, { values: state.newStep })
        .then(response => {
          commit('resetNewStep', getters.current)
          commit('addStep', response.data)
        })
    }
  }
}
