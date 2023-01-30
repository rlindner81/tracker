// https://firebase.google.com/docs/reference/admin
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, readBackup, overwriteCollection } from "./firebase.mjs";

const RESTORE_COLLECTIONS = {
  "tracks.json": "new-tracks",
  "steps.json": "new-steps",
};

const main = async () => {
  const app = await initializeApp();
  const db = getFirestore(app);

  for (const [filename, collectionId] of Object.entries(RESTORE_COLLECTIONS)) {
    const collectionRef = db.collection(collectionId);
    const data = await readBackup(filename);
    console.log("read from '%s'", filename);
    await overwriteCollection(app, collectionRef, data);
  }
};

main();
