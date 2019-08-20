const http = require("http")
const app = require("../src/app")
const { user, request, getSessionCookie } = require("./helper")

describe("Auth APIs", function() {
  let server
  let sessionCookie

  beforeAll(done => {
    server = http.createServer(app)
    server.listen(() => {
      return getSessionCookie(server).then(cookie => {
        sessionCookie = cookie
        done()
      })
    })
  })

  afterAll(done => {
    server.close(done)
  })

  it("GET /api/track", async function() {
    const res = await request(server)
      .get("/api/track")
      .set("Cookie", sessionCookie)
      .expect("Content-Type", /json/)
      .expect(200)
    expect(res.body.name).toBe(user.name)
    expect(res.body.email).toBe(user.email)
    expect("password" in res.body).toBe(false)
  })
})
