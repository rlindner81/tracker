import { fetchJson, fetchResponse, guardedFetchText } from "@/fetchWrapper";

export default {
  namespaced: true,
  state: {
    user: null,
  },
  mutations: {
    set(state, data) {
      state.user = data;
    },
    clear(state) {
      state.user = null;
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.user !== null;
    },
  },
  actions: {
    async loadSessionUser({ commit }) {
      const response = await fetchResponse("/api/auth/me");
      response.ok && commit("set", await response.json());
    },
    async login({ commit }, loginUser) {
      const data = await guardedFetchText("/api/auth/login", <RequestInit>{
        method: "POST",
        body: <any>JSON.stringify(loginUser),
      });
      debugger;
      data && commit("set", loginUser);
    },
    async logout({ commit }) {
      const data = await guardedFetchText("/api/auth/logout", <RequestInit>{
        method: "POST",
      });
      debugger;
      data && commit("clear");
    },
    async register({ commit }, registerUser) {
      const data = await guardedFetchText("/api/auth/register", <RequestInit>{
        method: "POST",
        body: <any>JSON.stringify(registerUser),
      });
      debugger;
      data && commit("set", registerUser);
    },
  },
};
