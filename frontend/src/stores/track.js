import axios from 'axios'

export default {
  namespaced: true,
  state: {
    data: [
      { _id: 1, name: 'Finanzen', stepCount: 5 },
      { _id: 2, name: 'Gewicht', stepCount: 15 },
      { _id: 3, name: 'Sport', stepCount: 3 },
      { _id: 4, name: 'Trinken', stepCount: 22 },
      { _id: 5, name: 'Essen', stepCount: 107 }
    ],
    current: {
      _id: 1,
      name: 'Finanzen',
      steps: [
        { title: 'Waschmaschine', negative: true, value: 499 },
        { title: 'Billard', negative: true, value: 20 },
        { title: 'Penny', negative: true, value: 12 },
        { title: 'Proberaum', negative: true, value: 150 },
        { title: 'Proberaum Alex', negative: false, value: 35 },
        { title: 'Waschmaschine', negative: true, value: 499 },
        { title: 'Waschmaschine', negative: true, value: 499 },
        { title: 'Waschmaschine', negative: true, value: 499 }
      ]
    },
    new: {
      name: null,
      fields: []
    },
    types: ['TEXT', 'SELECT_SINGLE', 'TIME']
  },
  mutations: {
    set (state, data) {
      state.data = data
    },
    clear (state) {
      state.data = null
    },
    add (state, data) {
      state.data.push(data)
    },
    addField (state) {
      state.new.fields.push({
        position: state.new.fields.length,
        key: null,
        name: null,
        input: true,
        type: 'TEXT',
        generator: {
          identifier: 'STATIC',
          paramters: {
            value: null
          }
        }
      })
    }
  },
  getters: {
    titleById: state => id => {
      let entry = state.data.find(entry => entry._id === parseInt(id))
      return entry ? entry.name : null
    }
  },
  actions: {
    create ({ commit, state }) {
      axios.post('/api/track', state.new)
        .then(response => {
          commit('add', response.data)
        })
    }
  }
}
