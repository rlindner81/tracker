import { initializeApp, readUsers, writeBackup } from "./firebase.mjs";

const USER_FILENAME = "users.json";
const main = async () => {
  const app = await initializeApp();

  const documentsData = await readUsers(app);
  await writeBackup(USER_FILENAME, documentsData);
};

main();
