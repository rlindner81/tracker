import { guardedFetch } from "@/fetchWrapper";

export default {
  namespaced: true,
  state: {
    data: null,
    login: {
      nameOrEmail: null,
      password: null,
    },
    register: {
      name: null,
      email: null,
      password: null,
    },
  },
  mutations: {
    set(state, data) {
      state.data = data;
    },
    clear(state) {
      state.data = null;
    },
  },
  getters: {},
  actions: {
    init({ commit }) {
      return guardedFetch("/api/auth/me").then((response) => {
        debugger;
        commit("set", response.json);
      });
    },
    login({ commit }) {
      return guardedFetch(<RequestInfo>{
        method: "post",
        url: "/api/auth/login",
      }).then((response) => {
        commit("set", response.json);
      });
    },
    register({ commit }) {
      return guardedFetch(<RequestInfo>{
        method: "post",
        url: "/api/auth/register",
      }).then((response) => {
        commit("set", response.json);
      });
    },
  },
};
