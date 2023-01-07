import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { app } from "@/firebase/app";
import router from "@/router";
import { guardedFetchText } from "@/fetchWrapper";
import { useCommonStore } from "@/store/common";

export const auth = getAuth(app);

let isUserInitialized = false;
let resolveUserInitialized;
const userInitializedPromise = new Promise((resolve) => (resolveUserInitialized = resolve));

export const observeAuthChanges = () => {
  const commonStore = useCommonStore();
  onAuthStateChanged(auth, async (user) => {
    commonStore.setUser(user || null);
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
};

export const loadSessionUser = async () => {
  await userInitializedPromise;
};

export const login = async ({ email, password }) => {
  const commonStore = useCommonStore();
  commonStore.increaseBusy();
  try {
    await Promise.all([
      signInWithEmailAndPassword(auth, email, password),
      guardedFetchText("/api/auth/login", <RequestInit>{
        method: "POST",
        body: <any>JSON.stringify({ nameOrEmail: email, password }),
      }),
    ]);
  } catch (err) {
    commonStore.addTransientError((err as Error)?.message);
  }
  commonStore.decreaseBusy();
};

export const logout = async () => {
  const commonStore = useCommonStore();
  commonStore.increaseBusy();
  try {
    await Promise.all([
      signOut(auth),
      guardedFetchText("/api/auth/logout", <RequestInit>{
        method: "POST",
      }),
    ]);
  } catch (err) {
    commonStore.addTransientError((err as Error)?.message);
  }
  commonStore.decreaseBusy();
};

export const register = async ({ email, password }) => {
  const commonStore = useCommonStore();
  commonStore.increaseBusy();
  try {
    await Promise.all([
      createUserWithEmailAndPassword(auth, email, password),
      guardedFetchText("/api/auth/register", <RequestInit>{
        method: "POST",
        body: <any>JSON.stringify({ name: email, email, password }),
      }),
    ]);
  } catch (err) {
    commonStore.addTransientError((err as Error)?.message);
  }
  commonStore.decreaseBusy();
};
