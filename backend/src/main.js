import admin from "firebase-admin";
import { getApp } from "firebase-admin/app";
import { readFile } from "fs/promises";
import { getFirestore } from "firebase-admin/firestore";
import Batch from "./Batch.mjs";

const accountFilepath = new URL("../../temp/trackit-f1b79-firebase-adminsdk-5o81p-fff95050db.json", import.meta.url);
const readJSON = async (filename) => JSON.parse((await readFile(filename)).toString());
const initializeApp = async () => {
  const serviceAccount = await readJSON(accountFilepath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  return getApp();
};

const updateSteps = async (db) => {
  // const usersRef = db.collection("users");
  const stepsRef = db.collection("steps");
  const tracksRef = db.collection("tracks");

  const batch = new Batch(db);
  const docs = (await tracksRef.get()).docs;
  for (const doc of docs) {
    const trackId = doc.id;
    const { count } = (await stepsRef.where("track_id", "==", trackId).count().get()).data();
    batch.update(doc.ref, "step_count", count);
  }
  await batch.commit();
};

const main = async () => {
  const app = await initializeApp();
  const db = await getFirestore(app);

  // await updateSteps(db);
};

main();
