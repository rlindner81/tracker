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
import { unsubscribe } from "@/firebase/db";

export const auth = getAuth(app);

let isUserInitialized = false;
let resolveUserInitialized;
export const userInitializedPromise = new Promise((resolve) => (resolveUserInitialized = resolve));

export const observeAuthChanges = () => {
  onAuthStateChanged(auth, async (user) => {
    useCommonStore().setUser(user || null);
    if (!isUserInitialized) {
      resolveUserInitialized();
      isUserInitialized = true;
    }
  });
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
  await router.replace({ name: "Home" });
};

export const logout = async () => {
  const commonStore = useCommonStore();
  commonStore.increaseBusy();
  try {
    unsubscribe();
    // NOTE the web-channel terminate calls will fail "blocked_by_client" if an ad-blocker is active
    await signOut(auth);
  } catch (err) {
    commonStore.addTransientError((err as Error)?.message);
  }
  commonStore.decreaseBusy();
  await router.replace({ name: "Login" });
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
