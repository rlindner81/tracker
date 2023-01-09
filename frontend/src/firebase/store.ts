import { onSnapshot, collection, query, where, orderBy, Timestamp, getFirestore } from "firebase/firestore";
import { app } from "@/firebase/app";
import { useCommonStore } from "@/store/common";
import { useTrackStore } from "@/store/track";
import { useStepStore } from "@/store/step";

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

export const subscribeToTracks = () => {
  const userId = useCommonStore().userId;
  if (userId) {
    tracksUnsubscribe = onSnapshot(
      query(tracksRef, where("userId", "==", userId), orderBy("createdAt", "desc")),
      (querySnapshot) => {
        // const tracks = prepareDocs(querySnapshot.docs);
        // debugger;
        useTrackStore().setTracks(prepareDocs(querySnapshot.docs));
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

export const subscribeToSteps = () => {
  const userId = useCommonStore().userId;
  const trackId = useTrackStore().currentId;
  if (trackId) {
    stepsUnsubscribe = onSnapshot(
      query(stepsRef, where("userId", "==", userId), where("trackId", "==", trackId), orderBy("createdAt", "desc")),
      (querySnapshot) => {
        useStepStore().setSteps(prepareDocs(querySnapshot.docs));
      },
      (err) => {
        console.error(err.message);
      }
    );
  } else {
    stepsUnsubscribe && stepsUnsubscribe();
  }
};
