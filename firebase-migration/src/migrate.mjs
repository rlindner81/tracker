// https://firebase.google.com/docs/reference/admin
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore
import admin from "firebase-admin";
import { getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFile } from 'fs/promises';

const accountFilepath = new URL("../../temp/trackit-f1b79-firebase-adminsdk-5o81p-fff95050db.json", import.meta.url);

const main = async () => {
  console.log("initialize firebase");
  const serviceAccountRaw = await readFile(accountFilepath, "utf-8");
  const serviceAccount = JSON.parse(serviceAccountRaw);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  const app = getApp();
  const database = getFirestore(app);
  debugger;
};

main();
