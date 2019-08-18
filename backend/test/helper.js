const request = require("supertest")

const user = {
  name: "test",
  email: "test@test.com",
  password: "test"
}

async function getSessionCookie(server) {
  await request(server)
    .post("/api/auth/register")
    .send(user)
  const res = await request(server)
    .post("/api/auth/login")
    .send({
      nameOrEmail: user.name,
      password: user.password
    })
  return res.headers["set-cookie"]
}

module.exports = {
  user,
  getSessionCookie
}
