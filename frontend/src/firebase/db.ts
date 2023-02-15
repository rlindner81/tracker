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
  limit,
} from "firebase/firestore";
import { app } from "@/firebase/app";
import { useCommonStore } from "@/store/common";

export const db = getFirestore(app);

const usersRef = collection(db, "users");
const tracksRef = collection(db, "tracks");
const stepsRef = collection(db, "steps");

let usersUnsubscribe;
let tracksUnsubscribe;
let stepsUnsubscribe;

let usersLoaded = false;
let resolveUsersLoaded;
export const usersLoadedPromise = new Promise((resolve) => (resolveUsersLoaded = resolve));
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

export const unsubscribeUsers = () => {
  if (usersUnsubscribe) {
    usersUnsubscribe();
    usersUnsubscribe = undefined;
  }
};

export const unsubscribeTracks = () => {
  if (tracksUnsubscribe) {
    tracksUnsubscribe();
    tracksUnsubscribe = undefined;
  }
};

export const unsubscribeSteps = () => {
  if (stepsUnsubscribe) {
    stepsUnsubscribe();
    stepsUnsubscribe = undefined;
  }
};

export const unsubscribe = () => {
  unsubscribeUsers();
  unsubscribeTracks();
  unsubscribeSteps();
};

export const subscribeToUsers = (callback) => {
  unsubscribeUsers();
  usersUnsubscribe = onSnapshot(
    query(usersRef, orderBy("email")),
    (querySnapshot) => {
      const users = unpackSnapshotDocs(querySnapshot.docs);
      callback(users);
      if (!usersLoaded) {
        usersLoaded = true;
        resolveUsersLoaded();
      }
    },
    (err) => {
      console.error(err.message);
      useCommonStore().addTransientError("error during user subscribe");
    }
  );
};

export const subscribeToTracks = (userId, callback) => {
  if (!userId) {
    unsubscribeTracks();
    unsubscribeSteps();
  }
  tracksUnsubscribe = onSnapshot(
    query(tracksRef, where("members", "array-contains", userId), orderBy("_created_at", "desc"), limit(100)),
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
    members: [userId],
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
    query(stepsRef, where("track_id", "==", trackId), orderBy("posted_at", "desc"), limit(100)),
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
