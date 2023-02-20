// https://firebase.google.com/docs/reference/admin
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, readBackup, overwriteCollection } from "./firebase.mjs";

const RESTORE_COLLECTIONS = {
  "users-01.json": "users",
  "tracks-01.json": "tracks",
  "steps-01.json": "steps",
};

const main = async () => {
  const app = await initializeApp();
  const db = getFirestore(app);

  for (const [filename, collectionId] of Object.entries(RESTORE_COLLECTIONS)) {
    const collectionRef = db.collection(collectionId);
    const data = await readBackup(filename);
    await overwriteCollection(app, collectionRef, data);
  }
};

main();
