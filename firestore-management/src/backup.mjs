// https://firebase.google.com/docs/reference/admin
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, readCollection, writeJsonFile } from "./firebase.mjs";

const BACKUP_COLLECTIONS = {
  tracks: "tracks.json",
  steps: "steps.json",
};

const backupFile = (filename) =>
  new URL(`../backup/${filename}`, import.meta.url);

const main = async () => {
  const app = await initializeApp();

  for (const [collectionId, filename] of Object.entries(BACKUP_COLLECTIONS)) {
    const collectionRef = await getFirestore(app).collection(collectionId);
    if (!collectionRef) continue;

    const documentsData = await readCollection(collectionRef);
    await writeJsonFile(backupFile(filename), documentsData);
    console.log("saved to '%s'", filename);
  }
};

main();
