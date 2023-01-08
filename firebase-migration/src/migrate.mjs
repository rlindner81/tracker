// https://firebase.google.com/docs/reference/admin
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth
import { format } from "util";
import { readFile } from "fs/promises";
import admin from "firebase-admin";
import { getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import dataService from "./nedb-interface.cjs";

const MAX_WRITES_PER_BATCH = 500; /** https://cloud.google.com/firestore/quotas#writes_and_transactions */
const MIGRATE_USER = "sommernavi@gmail.com";

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

const deleteCollection = async (db, colRef) => {
  console.log("deleting collection '%s'", colRef.id);
  const snapshot = await colRef.get();
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

const createUserIdMap = async (app) => {
  const auth = getAuth(app);
  const userIdMap = {};

  const oldUsers = await dataService.users.find({}).execAsync();
  const { users: newUsers } = await auth.listUsers();
  for (const oldUser of oldUsers) {
    const newUser = newUsers.find((newUser) => newUser.email === oldUser.email);
    userIdMap[oldUser._id] = {
      oldUser,
      ...(newUser && { uid: newUser.uid, newUser }),
    };
  }
  return userIdMap;
};

const _mapIdField = (field, object, map) => {
  if (!map[object[field]] || !map[object[field]].uid) {
    throw new Error(
      format(
        "could not find matching uid for field %s id %s",
        field,
        object[field]
      )
    );
  }
  object[field] = map[object[field]].uid;
};

const transferTracks = async (app, userIdMap) => {
  const db = getFirestore(app);
  const trackIdMap = {};

  const oldTracks = await dataService.tracks.find({}).execAsync();
  const tracksColRef = db.collection("tracks");

  const count = (await tracksColRef.count().get()).data().count;
  if (count !== 0) {
    await deleteCollection(db, tracksColRef);
  }

  const batch = db.batch();
  let batchCount = 0;

  for (const oldTrack of oldTracks) {
    const newTrack = { ...oldTrack };
    Reflect.deleteProperty(newTrack, "_id");
    _mapIdField("userId", newTrack, userIdMap);

    const newTrackRef = tracksColRef.doc();
    batch.create(newTrackRef, newTrack);
    batchCount++;
    if (batchCount >= MAX_WRITES_PER_BATCH) {
      throw Error("too many operations in batch");
    }

    trackIdMap[oldTrack._id] = { uid: newTrackRef.id, oldTrack, newTrack };
  }
  await batch.commit();
  return trackIdMap;
};

const transferSteps = async (app, userIdMap, trackIdMap) => {
  const db = getFirestore(app);
  const stepIdMap = {};

  const oldSteps = await dataService.steps.find({}).execAsync();
  const stepsColRef = db.collection("steps");

  const count = (await stepsColRef.count().get()).data().count;
  if (count !== 0) {
    await deleteCollection(db, stepsColRef);
  }

  const batch = db.batch();
  let batchCount = 0;

  for (const oldStep of oldSteps) {
    if (!trackIdMap[oldStep.trackId]) {
      console.log(
        "skipping step %s with no associated track %s",
        oldStep._id,
        oldStep.trackId
      );
      continue;
    }

    const newStep = { ...oldStep };
    Reflect.deleteProperty(newStep, "_id");
    _mapIdField("userId", newStep, userIdMap);
    _mapIdField("trackId", newStep, trackIdMap);

    const newStepRef = stepsColRef.doc();
    batch.create(newStepRef, newStep);
    batchCount++;
    if (batchCount >= MAX_WRITES_PER_BATCH) {
      throw Error("too many operations in batch");
    }

    stepIdMap[oldStep._id] = { uid: newStepRef.id, oldStep, newStep };
  }
  await batch.commit();
  return stepIdMap;
};

const main = async () => {
  console.log("initialize firebase");
  const serviceAccount = await readJsonFile(accountFilepath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  const app = getApp();

  console.log("creating user id map");
  const userIdMap = await createUserIdMap(app);
  console.log("transferring tracks");
  const trackIdMap = await transferTracks(app, userIdMap);
  console.log("transferred %i tracks", Object.keys(trackIdMap).length);
  const stepIdMap = await transferSteps(app, userIdMap, trackIdMap);
  console.log("transferred %i steps", Object.keys(stepIdMap).length);
};

main();
