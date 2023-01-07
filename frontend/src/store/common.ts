import type { User } from "firebase/auth";

import { defineStore } from "pinia";

const TRANSIENT_ERROR_DELAY = 5000;

interface State {
  busy: number;
  errors: Error[];
  user: User | null;
}

export const useCommonStore = defineStore("common", {
  state: (): State => ({
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
  },
});
