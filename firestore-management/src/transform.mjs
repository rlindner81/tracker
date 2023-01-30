// https://firebase.google.com/docs/reference/admin
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth
import { getFirestore } from "firebase-admin/firestore";
import {
  initializeApp,
  readBackup,
  overwriteCollection,
  writeBackup,
} from "./firebase.mjs";

const TRANSFORM_COLLECTIONS = {
  "tracks.json": {
    newFilename: "new-tracks.json",
    transform: (track) => track,
  },
  "steps.json": { newFilename: "new-steps.json", transform: (step) => step },
};

const main = async () => {
  for (const [oldFilename, { newFilename, transform }] of Object.entries(
    TRANSFORM_COLLECTIONS
  )) {
    const oldData = await readBackup(oldFilename);
    const newData = Object.entries(oldData).reduce((result, [key, value]) => {
      result[key] = transform(value);
      return result;
    }, {});
    await writeBackup(newFilename, newData);
  }
};

main();
