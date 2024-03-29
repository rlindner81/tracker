// https://firebase.google.com/docs/reference/admin
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, readCollection, writeBackup } from "./firebase.mjs";

const BACKUP_COLLECTIONS = {
  users: "users-01.json",
  tracks: "tracks-01.json",
  steps: "steps-01.json",
};

const main = async () => {
  const app = await initializeApp();

  for (const [collectionId, filename] of Object.entries(BACKUP_COLLECTIONS)) {
    const collectionRef = await getFirestore(app).collection(collectionId);
    if (!collectionRef) continue;

    const documentsData = await readCollection(collectionRef);
    await writeBackup(filename, documentsData);
  }
};

main();
