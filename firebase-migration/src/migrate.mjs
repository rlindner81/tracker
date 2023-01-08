// https://firebase.google.com/docs/reference/admin
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore
import { readFile } from "fs/promises";
import admin from "firebase-admin";
import { getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const MAX_WRITES_PER_BATCH = 500; /** https://cloud.google.com/firestore/quotas#writes_and_transactions */

const accountFilepath = new URL(
  "../../temp/trackit-f1b79-firebase-adminsdk-5o81p-fff95050db.json",
  import.meta.url
);
const readJsonFile = async (filepath) =>
  JSON.parse(await readFile(filepath, "utf-8"));

const chunk = (input, chunkSize) => {
  const result = [];
  for (let i = 0; i < input.length; i += chunkSize) {
    result.push(input.slice(i, i + chunkSize));
  }
  return result;
};

const deleteCollection = async (db, collection) => {
  console.log("deleting collection '%s'", collection);
  const snapshot = await db.collection(collection).get();
  let records = 0;

  const batches = chunk(snapshot.docs, MAX_WRITES_PER_BATCH);
  const commitBatchPromises = [];

  batches.forEach((batch) => {
    records += batch.length;
    const writeBatch = db.batch();
    batch.forEach((doc) => {
      writeBatch.delete(doc.ref);
    });
    commitBatchPromises.push(writeBatch.commit());
  });

  await Promise.all(commitBatchPromises);
  console.log("deleted %i records", records);
};

const writeCollection = async (db, collection, data) => {
  console.log("writing %i records to collection '%s'", data.length, collection);
  const colRef = await db.collection(collection);
  let records = 0;

  const batches = chunk(data, MAX_WRITES_PER_BATCH);
  const commitBatchPromises = [];

  batches.forEach((batch) => {
    records += batch.length;
    const writeBatch = db.batch();
    batch.forEach((record) => {
      writeBatch.create(colRef.doc(), record);
    });
    commitBatchPromises.push(writeBatch.commit());
  });

  await Promise.all(commitBatchPromises);
  console.log("written %i records", records);
};

const main = async () => {
  console.log("initialize firebase");
  const serviceAccount = await readJsonFile(accountFilepath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  const app = getApp();
  const db = getFirestore(app);

  // await deleteCollection(db, "tracks");
  await writeCollection(db, "tracks", [{ name: "a" }, { name: "b" }]);
};

main();
