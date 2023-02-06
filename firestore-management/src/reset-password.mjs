import { initializeApp, resetPassword } from "./firebase.mjs";

const RESET_PASSWORDS = {
  // "kasselmann.jana@gmail.com": "test1234",
};

const main = async () => {
  const app = await initializeApp();

  for (const [email, password] of Object.entries(RESET_PASSWORDS)) {
    await resetPassword(app, email, password);
  }
};

main();
