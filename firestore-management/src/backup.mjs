// https://firebase.google.com/docs/reference/admin
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, readCollection, writeJsonFile } from "./firebase.mjs";

const BACKUP_COLLECTIONS = ["tracks", "steps"];

const backupFile = (filename) =>
  new URL(`../backup/${filename}`, import.meta.url);

const main = async () => {
  console.log("initialize firebase");
  const app = await initializeApp();

  for (const collectionId of BACKUP_COLLECTIONS) {
    const collectionRef = await getFirestore(app).collection(collectionId);
    if (!collectionRef) continue;

    const filename = `${collectionId}.json`;
    const documentsData = await readCollection(collectionRef);
    await writeJsonFile(backupFile(filename), documentsData);
    console.log(
      "saved collection '%s' (%i documents) to '%s'",
      collectionId,
      Object.keys(documentsData).length,
      filename
    );
  }
};

main();
