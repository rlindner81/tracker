// https://firebase.google.com/docs/reference/admin
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth
import admin from "firebase-admin";
import { getApp } from "firebase-admin/app";
import { readFile, writeFile } from "fs/promises";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import Batch from "./Batch.mjs";
import { getAuth } from "firebase-admin/auth";

const accountFilepath = new URL(
  "../../temp/trackit-f1b79-firebase-adminsdk-5o81p-2735d318f7.json",
  import.meta.url
);

const backupFile = (filename) =>
  new URL(`../backup/${filename}`, import.meta.url);

export const orderedStringify = (value, replacer, space) => {
  const allKeys = Object.create(null);
  JSON.stringify(value, (k, v) => {
    allKeys[k] = null;
    return v;
  });
  return JSON.stringify(value, Object.keys(allKeys).sort(), space);
};
export const readBackup = async (filename) => {
  const result = JSON.parse(await readFile(backupFile(filename), "utf-8"));
  console.log("read from '%s'", filename);
  return result;
};

const readJSON = async (filename) =>
  JSON.parse(await readFile(filename, "utf-8"));

export const writeBackup = async (filename, data) => {
  const result = await writeFile(
    backupFile(filename),
    orderedStringify(data, null, 2) + "\n",
    "utf-8"
  );
  console.log("saved to '%s'", filename);
  return result;
};

export const isObject = (node) => typeof node === "object" && node !== null;

export const restoreTimestamps = (node) => {
  if (!isObject(node)) return node;
  for (const [key, value] of Object.entries(node)) {
    if (isObject(value)) {
      if (value._seconds !== undefined && value._nanoseconds !== undefined) {
        node[key] = new Timestamp(value._seconds, value._nanoseconds);
      } else {
        node[key] = restoreTimestamps(value);
      }
    }
  }
  return node;
};

export const initializeApp = async () => {
  const serviceAccount = await readJSON(accountFilepath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  return getApp();
};

export const readCollection = async (collectionRef) => {
  const docs = (await collectionRef.get()).docs;
  const docsData = docs.reduce((result, doc) => {
    result[doc.id] = doc.data();
    return result;
  }, {});
  console.log(
    "read %i docs from collection '%s'",
    docs.length,
    collectionRef.id
  );
  return docsData;
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
  console.log("wrote %i docs to collection '%s'", writeCount, collectionRef.id);
  await batch.commit();
};

export const readUsers = async (app) => {
  const auth = getAuth(app);

  const _listAllUsers = async (users = [], nextPageToken) => {
    const { users: pageUsers, pageToken } = await auth.listUsers(
      1000,
      nextPageToken
    );
    users = users.concat(pageUsers);
    pageToken && (await _listAllUsers(users, pageToken));
    return users;
  };
  const usersRaw = await _listAllUsers();
  return usersRaw.reduce((result, { uid, email }) => {
    result[uid] = { email };
    return result;
  }, {});
};

export const resetPassword = async (app, email, password) => {
  const auth = getAuth(app);
  const user = await auth.getUserByEmail(email);
  await auth.updateUser(user.uid, {
    email,
    emailVerified: true,
    password,
  });
};
