// https://firebase.google.com/docs/reference/admin
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth
import { getFirestore } from "firebase-admin/firestore";
import {
  initializeApp,
  readJsonFile,
  overwriteCollection,
} from "./firebase.mjs";

const RESTORE_COLLECTIONS = {
  "tracks.json": "new-tracks",
  "steps.json": "new-steps",
};

const backupFile = (filename) =>
  new URL(`../backup/${filename}`, import.meta.url);

const main = async () => {
  const app = await initializeApp();
  const db = getFirestore(app);

  for (const [filename, collectionId] of Object.entries(RESTORE_COLLECTIONS)) {
    const collectionRef = db.collection(collectionId);
    const data = await readJsonFile(backupFile(filename));
    console.log("read from '%s'", filename);
    await overwriteCollection(app, collectionRef, data);
  }
};

main();
