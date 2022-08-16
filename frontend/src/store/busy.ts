export default {
  namespaced: true,
  state: {
    busy: 0,
  },
  mutations: {
    increase(state) {
      state.busy++;
    },
    decrease(state) {
      state.busy--;
    },
  },
  getters: {
    isBusy(state) {
      return state.busy > 0;
    },
  },
};
