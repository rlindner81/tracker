const TRANSIENT_ERROR_DELAY = 3000;

export default {
  namespaced: true,
  state: {
    errors: [],
  },
  mutations: {
    add(state, error) {
      state.errors.push(error);
    },
    remove(state, error) {
      const errorIndex = state.errors.indexOf(error);
      errorIndex >= 0 && state.errors.splice(errorIndex, 1);
    },
  },
  getters: {},
  actions: {
    addTransientError({ commit }, error) {
      commit("add", error);
      setTimeout(() => commit("remove", error), TRANSIENT_ERROR_DELAY);
    },
  },
};
