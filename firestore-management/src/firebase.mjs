import admin from "firebase-admin";
import { getApp } from "firebase-admin/app";
import { readFile, writeFile } from "fs/promises";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import Batch from "./Batch.mjs";

const accountFilepath = new URL(
  "../../temp/trackit-f1b79-firebase-adminsdk-5o81p-fff95050db.json",
  import.meta.url
);

export const readJsonFile = async (filepath) =>
  JSON.parse(await readFile(filepath, "utf-8"));

export const writeJsonFile = async (filepath, data) =>
  await writeFile(filepath, JSON.stringify(data, null, 2) + "\n", "utf-8");

export const isObject = (node) => typeof node === "object" && node !== null;

export const restoreTimestamps = (node) => {
  if (!isObject(node)) return node;
  for (const [key, value] of Object.entries(node)) {
    if (isObject(value)) {
      if (value._seconds && value._nanoseconds) {
        node[key] = new Timestamp(value._seconds, value._nanoseconds);
      } else {
        node[key] = restoreTimestamps(value);
      }
    }
  }
  return node;
};

export const initializeApp = async () => {
  const serviceAccount = await readJsonFile(accountFilepath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  return getApp();
};

export const readCollection = async (collectionRef) => {
  return (await collectionRef.get()).docs.reduce((result, doc) => {
    result[doc.id] = doc.data();
    return result;
  }, {});
};

export const batchWriteCollection = async (batch, collectionRef, data) => {
  data = restoreTimestamps(data);
  const entries = Object.entries(data);
  for (const [key, value] of entries) {
    const newStepRef = collectionRef.doc(key);
    batch.create(newStepRef, value);
  }
  return entries.length;
};

export const batchDeleteCollection = async (batch, collectionRef) => {
  const docs = (await collectionRef.get()).docs;
  for (const doc of docs) {
    batch.delete(doc.ref);
  }
  return docs.length;
};

export const overwriteCollection = async (app, collectionRef, data) => {
  const batch = new Batch(getFirestore(app));
  const deleteCount = await batchDeleteCollection(batch, collectionRef);
  console.log(
    "deleted %i docs from collection '%s'",
    deleteCount,
    collectionRef.id
  );
  const writeCount = await batchWriteCollection(batch, collectionRef, data);
  console.log("write %i docs to collection '%s'", writeCount, collectionRef.id);
  await batch.commit();
};
