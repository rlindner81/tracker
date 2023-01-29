// https://firebase.google.com/docs/reference/admin
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth
import { readFile, writeFile } from "fs/promises";
import admin from "firebase-admin";
import { getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const accountFilepath = new URL(
  "../../temp/trackit-f1b79-firebase-adminsdk-5o81p-fff95050db.json",
  import.meta.url
);
const backupFile = (filename) =>
  new URL(`../backup/${filename}`, import.meta.url);

const readJsonFile = async (filepath) =>
  JSON.parse(await readFile(filepath, "utf-8"));

const writeJsonFile = async (filepath, data) =>
  await writeFile(
    backupFile(filepath),
    JSON.stringify(data, null, 2) + "\n",
    "utf-8"
  );

const getDocumentsData = async (collectionRef) => {
  return (await collectionRef.get()).docs.reduce((result, doc) => {
    result[doc.id] = doc.data();
    return result;
  }, {});
};

const main = async () => {
  console.log("initialize firebase");
  const serviceAccount = await readJsonFile(accountFilepath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  const app = getApp();

  const collectionRefs = await getFirestore(app).listCollections();
  for (const collectionRef of collectionRefs) {
    const collectionId = collectionRef.id;
    const fileName = `${collectionId}.json`;
    const documentsData = await getDocumentsData(collectionRef);
    await writeJsonFile(fileName, documentsData);
    console.log(
      "saved collection '%s' (%i documents) to '%s'",
      collectionId,
      Object.keys(documentsData).length,
      fileName
    );
  }
};

main();
