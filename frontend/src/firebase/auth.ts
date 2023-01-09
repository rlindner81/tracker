import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { app } from "@/firebase/app";
import router from "@/router";
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
    // TODO trigger change of active user?
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
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    commonStore.addTransientError((err as Error)?.message);
  }
  commonStore.decreaseBusy();
};

export const logout = async () => {
  const commonStore = useCommonStore();
  commonStore.increaseBusy();
  try {
    await signOut(auth);
  } catch (err) {
    commonStore.addTransientError((err as Error)?.message);
  }
  commonStore.decreaseBusy();
};

export const register = async ({ email, password }) => {
  const commonStore = useCommonStore();
  commonStore.increaseBusy();
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    commonStore.addTransientError((err as Error)?.message);
  }
  commonStore.decreaseBusy();
};
