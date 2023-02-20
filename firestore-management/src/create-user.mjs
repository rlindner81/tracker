import { initializeApp, createUser } from "./firebase.mjs";

const CREATE_USERS = [
  {
    uid: "c4tg7B5yTtNcUpZ1JMLWSWT4QjS2",
    email: "sommernavi@gmail.com",
  },
  {
    uid: "mLG8tsx7FrciccAilfXnIi2xtRB3",
    email: "max.grunfelder@gmail.com",
  },
  {
    uid: "LHhQ6v2CPtPH2941AfuIkZADi983",
    email: "kasselmann.jana@gmail.com",
  },
];

const main = async () => {
  const app = await initializeApp();

  for (const { uid, email } of CREATE_USERS) {
    await createUser(app, uid, email, "test1234");
  }
};

main();
