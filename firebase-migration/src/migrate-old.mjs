import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import dataService from './nedb-interface.cjs';

// TODO this should use the firebase-admin api

const MIGRATE_USER = {
  email: "sommernavi@gmail.com",
  password: process.env.TRACKER_MIGRATION_PASSWORD,
};

let db;
let auth;

const initializeFirebase = async () => {
  const firebaseConfig = {
    apiKey: "AIzaSyASZh5cjJLkhXivX2DDzX69rhvj2mYBVCQ",
    authDomain: "trackit-f1b79.firebaseapp.com",
    projectId: "trackit-f1b79",
    storageBucket: "trackit-f1b79.appspot.com",
    messagingSenderId: "191629398412",
    appId: "1:191629398412:web:b60e6f94b5c6e3d0f506a9",
  };

  const app = initializeApp(firebaseConfig);

  db = getFirestore(app);
  auth = getAuth(app);
  await signInWithEmailAndPassword(
    auth,
    MIGRATE_USER.email,
    MIGRATE_USER.password
  );
  return async () => {
    await signOut(auth);
  }
};

const loadTracksAndSteps = async () => {
  const idMap = {};

  const { _id: userId } = await dataService.users
    .findOne({ email: MIGRATE_USER.email })
    .execAsync();
  idMap[userId] = auth.currentUser.uid;

  const tracks = await dataService.tracks
    .find({ userId })
    .execAsync();
  const steps = await dataService.steps
    .find({ userId })
    .execAsync();

  const tracksRef = collection(db, "tracks");
  const stepsRef = collection(db, "steps");

  for (const track of tracks) {
    track.userId = idMap[track.userId];
    const oldId = track._id;
    Reflect.deleteProperty(track, "_id");

    let docRef = await addDoc(tracksRef, track);
    idMap[oldId] = docRef.id;
  }

  for (const step of steps) {
    step.userId = idMap[step.userId];
    step.trackId = idMap[step.trackId];
    // const oldId = step._id;
    Reflect.deleteProperty(step, "_id");

    if (step.trackId) {
      await addDoc(stepsRef, step);
    }
  }

}

const main = async () => {
  console.log("initialize firebase");
  const closeFirebase = await initializeFirebase();
  let currentUser = auth.currentUser;
  console.log(`logged in with ${currentUser.email}`);

  console.log("loading tracks and steps");
  await loadTracksAndSteps();

  await closeFirebase();
  console.log("success");
};

main();
