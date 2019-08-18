const http = require("http")
const request = require("supertest")
const app = require("../src/app")

describe("Auth APIs", function() {
  let server
  beforeAll(done => {
    server = http.createServer(app)
    server.listen(done)
  })
  afterAll(done => {
    server.close(done)
  })

  it("POST /api/auth/register", async function(done) {
    const user = {
      name: "test",
      email: "test@test.com",
      password: "test"
    }
    const res = await request(app)
      .post("/api/auth/register")
      .set("Accept", "application/json")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(200)
    expect(res.body.name).toBe(user.name)
    expect(res.body.email).toBe(user.email)
    expect("password" in res.body).toBe(false)
    done()
  })

  // it('POST /api/auth/login', function (done) {
  //   request(app)
  //     .get('/users')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200, done);
  // });

  // it('POST /api/auth/logout', function (done) {
  //   request(app)
  //     .get('/users')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200, done);
  // });

  // it('GET /api/auth/me', function (done) {
  //   request(app)
  //     .get('/users')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200, done);
  // });
})
