// https://firebase.google.com/docs/reference/admin
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore
import { readFile } from "fs/promises";
import admin from "firebase-admin";
import { getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const accountFilepath = new URL(
  "../../temp/trackit-f1b79-firebase-adminsdk-5o81p-fff95050db.json",
  import.meta.url
);
const readJsonFile = async (filepath) =>
  JSON.parse(await readFile(filepath, "utf-8"));

const deleteEmptyMessages = async () => {
  const snapshot = await firestore
    .collection("messages")
    .where("text", "==", "")
    .get();
  const MAX_WRITES_PER_BATCH = 500; /** https://cloud.google.com/firestore/quotas#writes_and_transactions */

  /**
   * `chunk` function splits the array into chunks up to the provided length.
   * You can get it from either:
   * - [Underscore.js](https://underscorejs.org/#chunk)
   * - [lodash](https://lodash.com/docs/4.17.15#chunk)
   * - Or one of [these answers](https://stackoverflow.com/questions/8495687/split-array-into-chunks#comment84212474_8495740)
   */
  const batches = chunk(snapshot.docs, MAX_WRITES_PER_BATCH);
  const commitBatchPromises = [];

  batches.forEach((batch) => {
    const writeBatch = firestore.batch();
    batch.forEach((doc) => writeBatch.delete(doc.ref));
    commitBatchPromises.push(writeBatch.commit());
  });

  await Promise.all(commitBatchPromises);
};

const main = async () => {
  console.log("initialize firebase");
  const serviceAccount = await readJsonFile(accountFilepath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  const app = getApp();
  const database = getFirestore(app);
  debugger;
};

main();
