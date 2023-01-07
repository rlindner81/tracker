import type { User } from "firebase/auth";

import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { defineStore } from "pinia";

import { guardedFetchText } from "@/fetchWrapper";
import { auth } from "@/firebase";
import router from "@/router";

const TRANSIENT_ERROR_DELAY = 5000;

let isUserInitialized = false;
let resolveUserInitialized;
const userInitializedPromise = new Promise((resolve) => (resolveUserInitialized = resolve));

export const useCommonStore = defineStore("common", {
  state: () => ({
    busy: 0,
    errors: [],
    user: null,
  }),

  getters: {
    isBusy(state): boolean {
      return state.busy > 0;
    },
    isLoggedIn(state): boolean {
      return state.user !== null;
    },
  },

  actions: {
    increaseBusy() {
      this.busy++;
    },
    decreaseBusy() {
      this.busy--;
    },
    addError(error) {
      this.errors.push(error);
    },
    removeError(error) {
      const errorIndex = this.errors.indexOf(error);
      errorIndex >= 0 && this.errors.splice(errorIndex, 1);
    },
    setUser(payload: User | null) {
      this.user = payload;
    },

    addTransientError(error) {
      this.addError(error);
      setTimeout(() => this.removeError(error), TRANSIENT_ERROR_DELAY);
    },

    observeAuthChanges() {
      onAuthStateChanged(auth, async (user) => {
        this.setUser(user || null);
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

    async login({ email, password }) {
      this.increaseBusy();
      try {
        await Promise.all([
          signInWithEmailAndPassword(auth, email, password),
          guardedFetchText("/api/auth/login", <RequestInit>{
            method: "POST",
            body: <any>JSON.stringify({ nameOrEmail: email, password }),
          }),
        ]);
      } catch (err) {
        this.addTransientError((err as Error)?.message);
      }
      this.decreaseBusy();
    },

    async logout() {
      this.increaseBusy();
      try {
        await Promise.all([
          signOut(auth),
          guardedFetchText("/api/auth/logout", <RequestInit>{
            method: "POST",
          }),
        ]);
      } catch (err) {
        this.addTransientError((err as Error)?.message);
      }
      this.decreaseBusy();
    },

    async register({ email, password }) {
      this.increaseBusy();
      try {
        await Promise.all([
          createUserWithEmailAndPassword(auth, email, password),
          guardedFetchText("/api/auth/register", <RequestInit>{
            method: "POST",
            body: <any>JSON.stringify({ name: email, email, password }),
          }),
        ]);
      } catch (err) {
        this.addTransientError((err as Error)?.message);
      }
      this.decreaseBusy();
    },
  },
});
