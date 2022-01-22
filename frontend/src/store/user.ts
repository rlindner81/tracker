import { guardedFetchJson } from "@/fetchWrapper";

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
      return guardedFetchJson("/api/auth/me").then((user) => {
        user && commit("set", user);
      });
    },
    login({ commit }) {
      return guardedFetchJson(<RequestInfo>{
        method: "POST",
        url: "/api/auth/login",
      }).then((user) => {
        user && commit("set", user);
      });
    },
    register({ commit }) {
      return guardedFetchJson(<RequestInfo>{
        method: "POST",
        url: "/api/auth/register",
      }).then((user) => {
        user && commit("set", user);
      });
    },
  },
};
