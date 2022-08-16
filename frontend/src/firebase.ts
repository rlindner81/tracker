import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyASZh5cjJLkhXivX2DDzX69rhvj2mYBVCQ",
  authDomain: "trackit-f1b79.firebaseapp.com",
  projectId: "trackit-f1b79",
  storageBucket: "trackit-f1b79.appspot.com",
  messagingSenderId: "191629398412",
  appId: "1:191629398412:web:b60e6f94b5c6e3d0f506a9",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
