import type { User } from "firebase/auth";
import { guardedFetchText } from "@/fetchWrapper";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import router from "@/router";

const TRANSIENT_ERROR_DELAY = 5000;

let isUserInitialized = false;
let resolveUserInitialized;
const userInitializedPromise = new Promise((resolve) => (resolveUserInitialized = resolve));

export default {
  namespaced: true,

  state: {
    busy: 0,
    errors: [],
    user: null,
  },

  mutations: {
    increaseBusy(state) {
      state.busy++;
    },
    decreaseBusy(state) {
      state.busy--;
    },
    addError(state, error) {
      state.errors.push(error);
    },
    removeError(state, error) {
      const errorIndex = state.errors.indexOf(error);
      errorIndex >= 0 && state.errors.splice(errorIndex, 1);
    },
    setUser(state, payload: User | null) {
      state.user = payload;
    },
  },

  getters: {
    isBusy(state) {
      return state.busy > 0;
    },
    isLoggedIn(state): boolean {
      return state.user !== null;
    },
  },

  actions: {
    addTransientError({ commit }, error) {
      commit("addError", error);
      setTimeout(() => commit("removeError", error), TRANSIENT_ERROR_DELAY);
    },

    observeAuthChanges({ commit }) {
      onAuthStateChanged(auth, async (user) => {
        commit("setUser", user || null);
        if (!isUserInitialized) {
          resolveUserInitialized();
          isUserInitialized = true;
        }
        if (user && router.currentRoute.value.matched.some((route) => route.name === "Unprotected")) {
          await router.replace({ name: "Home" });
        }
        if (!user && router.currentRoute.value.matched.some((route) => route.name === "Protected")) {
          await router.replace({ name: "Login" });
        }
      });
    },

    async loadSessionUser() {
      await userInitializedPromise;
    },

    async login({ commit, dispatch }, { email, password }) {
      commit("increaseBusy");
      try {
        await Promise.all([
          signInWithEmailAndPassword(auth, email, password),
          guardedFetchText("/api/auth/login", <RequestInit>{
            method: "POST",
            body: <any>JSON.stringify({ nameOrEmail: email, password }),
          }),
        ]);
      } catch (err) {
        dispatch("addTransientError", (err as Error)?.message);
      }
      commit("decreaseBusy");
    },

    async logout({ commit, dispatch }) {
      commit("increaseBusy");
      try {
        await Promise.all([
          signOut(auth),
          guardedFetchText("/api/auth/logout", <RequestInit>{
            method: "POST",
          }),
        ]);
      } catch (err) {
        dispatch("addTransientError", (err as Error)?.message);
      }
      commit("decreaseBusy");
    },

    async register({ commit, dispatch }, { email, password }) {
      commit("increaseBusy");
      try {
        await Promise.all([
          createUserWithEmailAndPassword(auth, email, password),
          guardedFetchText("/api/auth/register", <RequestInit>{
            method: "POST",
            body: <any>JSON.stringify({ name: email, email, password }),
          }),
        ]);
      } catch (err) {
        dispatch("addTransientError", (err as Error)?.message);
      }
      commit("decreaseBusy");
    },
  },
};
