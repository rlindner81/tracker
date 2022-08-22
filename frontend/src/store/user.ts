import { guardedFetchText } from "@/fetchWrapper";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth } from "@/firebase";
import router from "@/router";

let isUserInitialized = false;
let resolveUserInitialized;
const userInitializedPromise = new Promise(
  (resolve) => (resolveUserInitialized = resolve)
);

export default {
  namespaced: true,
  state: {
    user: null,
  },
  mutations: {
    setUser(state, payload: User | null) {
      state.user = payload;
    },
  },
  getters: {
    isLoggedIn(state): boolean {
      return state.user !== null;
    },
    getUser(state): User | null {
      return state.user;
    },
  },
  actions: {
    observeAuthChanges({ commit }) {
      onAuthStateChanged(auth, async (user) => {
        commit("setUser", user || null);
        if (!isUserInitialized) {
          resolveUserInitialized();
          isUserInitialized = true;
        }
        if (
          user &&
          router.currentRoute.value.matched.some(
            (route) => route.name === "Unprotected"
          )
        ) {
          await router.replace({ name: "Home" });
        }
        if (
          !user &&
          router.currentRoute.value.matched.some(
            (route) => route.name === "Protected"
          )
        ) {
          await router.replace({ name: "Login" });
        }
      });
    },

    async loadSessionUser() {
      await userInitializedPromise;
    },

    async login({ commit, dispatch }, { email, password }) {
      commit("busy/increase", null, { root: true });
      try {
        await Promise.all([
          signInWithEmailAndPassword(auth, email, password),
          guardedFetchText("/api/auth/login", <RequestInit>{
            method: "POST",
            body: <any>JSON.stringify({ nameOrEmail: email, password }),
          }),
        ]);
      } catch (err) {
        dispatch("error/addTransientError", err.message, { root: true });
      }
      commit("busy/decrease", null, { root: true });
    },

    async logout({ commit, dispatch }) {
      commit("busy/increase", null, { root: true });
      try {
        await Promise.all([
          signOut(auth),
          guardedFetchText("/api/auth/logout", <RequestInit>{
            method: "POST",
          }),
        ]);
      } catch (err) {
        dispatch("error/addTransientError", err.message, { root: true });
      }
      commit("busy/decrease", null, { root: true });
    },

    async register({ commit, dispatch }, { email, password }) {
      commit("busy/increase", null, { root: true });
      try {
        await Promise.all([
          createUserWithEmailAndPassword(auth, email, password),
          guardedFetchText("/api/auth/register", <RequestInit>{
            method: "POST",
            body: <any>JSON.stringify({ name: email, email, password }),
          }),
        ]);
      } catch (err) {
        dispatch("error/addTransientError", err.message, { root: true });
      }
      commit("busy/decrease", null, { root: true });
    },
  },
};
