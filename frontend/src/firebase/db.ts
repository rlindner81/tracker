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

let tracksLoaded = false;
let resolveTracksLoaded;
export const tracksLoadedPromise = new Promise((resolve) => (resolveTracksLoaded = resolve));

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

const unpackSnapshotDoc = (doc) => {
  const result = prepareObjectNode(doc.data());
  result._id = doc.id;
  return result;
};
const unpackSnapshotDocs = (docs) => docs.map(unpackSnapshotDoc);

const unsubscribeSteps = () => {
  if (stepsUnsubscribe) {
    stepsUnsubscribe();
    stepsUnsubscribe = undefined;
  }
};

const unsubscribeTracks = () => {
  if (tracksUnsubscribe) {
    tracksUnsubscribe();
    tracksUnsubscribe = undefined;
  }
};

export const unsubscribe = () => {
  unsubscribeSteps();
  unsubscribeTracks();
};

export const subscribeToTracks = (userId, callback) => {
  if (!userId) {
    unsubscribeSteps();
    unsubscribeTracks();
  }
  tracksUnsubscribe = onSnapshot(
    query(tracksRef, where("owner_id", "==", userId), orderBy("_created_at", "desc")),
    (querySnapshot) => {
      const tracks = unpackSnapshotDocs(querySnapshot.docs);
      callback(tracks);
      if (!tracksLoaded) {
        tracksLoaded = true;
        resolveTracksLoaded();
      }
    },
    (err) => {
      console.error(err.message);
      useCommonStore().addTransientError("error during track subscribe");
    }
  );
};

export const createTrack = async (userId, track) => {
  if (!userId || !track) return;
  const now = new Date();
  await addDoc(tracksRef, {
    ...track,
    owner_id: userId,
    _created_at: now,
    _created_by: userId,
    _updated_at: now,
    _updated_by: userId,
  });
};
export const updateTrack = async (userId, trackId, track) => {
  if (!userId || !trackId || !track) return;
  const now = new Date();
  const trackRef = doc(tracksRef, trackId);
  await setDoc(
    trackRef,
    {
      ...track,
      _updated_at: now,
      _updated_by: userId,
    },
    { merge: true }
  );
};

export const deleteTrack = async (trackId) => {
  if (!trackId) return;
  const trackRef = doc(tracksRef, trackId);
  await deleteDoc(trackRef);
};

export const subscribeToSteps = (userId, trackId, callback) => {
  if (!userId || !trackId) {
    unsubscribeSteps();
  }
  stepsUnsubscribe = onSnapshot(
    query(stepsRef, where("posted_by", "==", userId), where("track_id", "==", trackId), orderBy("_created_at", "desc")),
    (querySnapshot) => {
      const steps = unpackSnapshotDocs(querySnapshot.docs);
      callback(steps);
    },
    (err) => {
      console.error(err.message);
      useCommonStore().addTransientError("error during step subscribe");
    }
  );
};

export const createStep = async (userId, trackId, step) => {
  if (!userId || !trackId || !step) return;
  const now = new Date();
  await addDoc(stepsRef, {
    ...step,
    posted_by: userId,
    posted_at: now, // TODO this should be changeable in UI
    track_id: trackId,
    _created_at: now,
    _created_by: userId,
    _updated_at: now,
    _updated_by: userId,
  });
};
