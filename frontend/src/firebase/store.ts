import {
  getFirestore,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  Timestamp,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { app } from "@/firebase/app";
import { useCommonStore } from "@/store/common";

export const db = getFirestore(app);

const tracksRef = collection(db, "tracks");
const stepsRef = collection(db, "steps");

let tracksUnsubscribe;
let stepsUnsubscribe;

const prepareObjectNode = (parent) => {
  for (const [key, node] of Object.entries(parent)) {
    if (node instanceof Timestamp) {
      parent[key] = node.toDate();
    } else if (typeof node === "object" && node !== null) {
      parent[key] = prepareObjectNode(node);
    }
  }
  return parent;
};

const prepareDocs = (docs) =>
  docs.map((doc) => {
    const result = prepareObjectNode(doc.data());
    result.id = doc.id;
    return result;
  });

export const subscribeToTracks = (userId, callback) => {
  if (userId) {
    tracksUnsubscribe = onSnapshot(
      query(tracksRef, where("userId", "==", userId), orderBy("createdAt", "desc")),
      (querySnapshot) => {
        const tracks = prepareDocs(querySnapshot.docs);
        // debugger;
        callback(tracks);
      },
      (err) => {
        useCommonStore().addTransientError(err.message);
      }
    );
  } else {
    stepsUnsubscribe && stepsUnsubscribe();
    tracksUnsubscribe && tracksUnsubscribe();
  }
};

export const createTrack = async (track) => {
  if (!track) return;
  return await addDoc(tracksRef, track);
};
export const updateTrack = async (trackId, track) => {
  if (!trackId || !track) return;
  return await setDoc(doc(tracksRef, trackId), track);
};

export const deleteTrack = async (trackId) => {
  if (!trackId) return;
  return await deleteDoc(doc(tracksRef, trackId));
};

export const subscribeToSteps = (userId, trackId, callback) => {
  if (userId && trackId) {
    stepsUnsubscribe = onSnapshot(
      query(stepsRef, where("userId", "==", userId), where("trackId", "==", trackId), orderBy("createdAt", "desc")),
      (querySnapshot) => {
        const steps = prepareDocs(querySnapshot.docs);
        callback(steps);
      },
      (err) => {
        useCommonStore().addTransientError(err.message);
      }
    );
  } else {
    stepsUnsubscribe && stepsUnsubscribe();
  }
};

export const createStep = async (step) => {
  if (!step) return;
  return await addDoc(stepsRef, step);
};
