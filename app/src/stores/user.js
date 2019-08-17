import axios from 'axios'

export default {
  namespaced: true,
  state: {
    data: null,
    login: {
      nameOrEmail: null,
      password: null
    },
    register: {
      name: null,
      email: null,
      password: null
    }
  },
  mutations: {
    set (state, data) {
      state.data = data
    },
    clear (state) {
      state.data = null
    }
  },
  getters: {},
  actions: {
    init ({ commit }) {
      axios.get('/api/auth/me')
        .then(response => {
          commit('set', response.data)
        })
    },
    login ({ commit, state }) {
      axios.post('/api/auth/login', state.login)
        .then(response => {
          commit('set', response.data)
        })
    },
    register ({ commit, state }) {
      axios.post('/api/auth/register', state.register)
        .then(response => {
          commit('set', response.data)
        })
    }
  }
}
