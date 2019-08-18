const http = require("http")
const request = require("supertest")
const app = require("../src/app")
const { user } = require("./helper")

describe("Auth APIs", function() {
  let server
  let sessionCookie

  beforeAll(done => {
    server = http.createServer(app)
    server.listen(done)
  })

  afterAll(done => {
    server.close(done)
  })

  it("POST /api/auth/register", async function() {
    const res = await request(server)
      .post("/api/auth/register")
      .send(user)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
    expect(res.body.name).toBe(user.name)
    expect(res.body.email).toBe(user.email)
    expect("password" in res.body).toBe(false)
  })

  it("POST /api/auth/login", async function() {
    const res = await request(server)
      .post("/api/auth/login")
      .send({
        nameOrEmail: user.name,
        password: user.password
      })
      .expect("Set-Cookie", /connect.sid/)
      .expect("Content-Type", /text\/html/)
      .expect(200)
    sessionCookie = res.headers["set-cookie"]
    expect(res.text).toBe("Login successful")
  })

  it("GET /api/auth/me", async function() {
    const res = await request(server)
      .get("/api/auth/me")
      .set("Cookie", sessionCookie)
      .expect("Content-Type", /json/)
      .expect(200)
    expect(res.body.name).toBe(user.name)
    expect(res.body.email).toBe(user.email)
    expect("password" in res.body).toBe(false)
  })

  it("POST /api/auth/logout", async function() {
    const res = await request(server)
      .post("/api/auth/logout")
      .send()
      .set("Cookie", sessionCookie)
      .expect("Content-Type", /text\/html/)
      .expect(200)
    expect(res.text).toBe("Logout successful")
  })
})
