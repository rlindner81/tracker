export default {
  namespaced: true,
  state: {
    busy: 0
  },
  mutations: {
    start (state) {
      state.busy++
    },
    end (state) {
      state.busy--
    }
  },
  getters: {
    busy (state) {
      return state.busy > 0
    }
  }
}
