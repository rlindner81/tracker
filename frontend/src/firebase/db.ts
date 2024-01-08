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

export const subscribeToUsers = async (callback) => {
  unsubscribeUsers();
  const userQuery = query(usersRef, orderBy("email"));
  const processSnapshot = (snapshot) => {
    const users = unpackSnapshotDocs(snapshot.docs);
    callback(users);
    if (!usersLoaded) {
      usersLoaded = true;
      resolveUsersLoaded();
    }
  };
  // processSnapshot(await getDocs(userQuery));
  usersUnsubscribe = onSnapshot(userQuery, processSnapshot, (err) => {
    console.error(err.message);
    useCommonStore().addTransientError("error during user subscribe");
  });
};

export const subscribeToTracks = async (userId, callback) => {
  if (!userId) {
    unsubscribeTracks();
    unsubscribeSteps();
  }
  const trackQuery = query(
    tracksRef,
    where("members", "array-contains", userId),
    orderBy("_created_at", "desc"),
    limit(1000),
  );
  const processSnapshot = (snapshot) => {
    const tracks = unpackSnapshotDocs(snapshot.docs);
    callback(tracks);
    if (!tracksLoaded) {
      tracksLoaded = true;
      resolveTracksLoaded();
    }
  };
  // processSnapshot(await getDocs(trackQuery));
  tracksUnsubscribe = onSnapshot(trackQuery, processSnapshot, (err) => {
    console.error(err.message);
    useCommonStore().addTransientError("error during track subscribe");
  });
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
    { merge: true },
  );
};

export const deleteTrack = async (trackId) => {
  if (!trackId) return;
  const trackRef = doc(tracksRef, trackId);
  await deleteDoc(trackRef);
};

export const subscribeToSteps = async (userId, trackId, callback) => {
  if (!userId || !trackId) {
    unsubscribeSteps();
  }
  const stepQuery = query(stepsRef, where("track_id", "==", trackId), orderBy("posted_at", "desc"), limit(1000));
  const processSnapshot = (snapshot) => {
    const steps = unpackSnapshotDocs(snapshot.docs);
    callback(steps);
  };
  // processSnapshot(await getDocs(stepQuery));
  stepsUnsubscribe = onSnapshot(stepQuery, processSnapshot, (err) => {
    console.error(err.message);
    useCommonStore().addTransientError("error during step subscribe");
  });
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

export const updateStep = async (userId, trackId, stepId, step) => {
  if (!userId || !trackId || !stepId || !step) return;
  const now = new Date();
  const stepRef = doc(stepsRef, stepId);
  await setDoc(
    stepRef,
    {
      ...step,
      _updated_at: now,
      _updated_by: userId,
    },
    { merge: true },
  );
};
