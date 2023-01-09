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
  onAuthStateChanged(auth, async (user) => {
    useCommonStore().setUser(user || null);
    if (
      (user && router.currentRoute.value.matched.length === 0) ||
      router.currentRoute.value.matched.some((route) => route.name === "Unprotected")
    ) {
      await router.replace({ name: "Home" });
    }
    if (
      !user &&
      (router.currentRoute.value.matched.length === 0 ||
        router.currentRoute.value.matched.some((route) => route.name === "Protected"))
    ) {
      await router.replace({ name: "Login" });
    }
    if (!isUserInitialized) {
      resolveUserInitialized();
      isUserInitialized = true;
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
