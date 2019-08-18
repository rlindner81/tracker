export default {
  namespaced: true,
  state: {
    errors: []
  },
  mutations: {
    raw (state, error) {
      let e = {
        _id: Math.random(),
        message: error.response.data
      }

      state.errors = [e]

      setTimeout(() => {
        state.errors = state.errors.filter(message => {
          return message._id !== e._id
        })
      }, 4000)
    }
  },
  getters: {},
  actions: {}
}
