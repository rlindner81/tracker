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
    const response = await request(app).post(
      "/api/auth/register",
      JSON.stringify({
        name: "test",
        emails: "test@test.com",
        password: "test"
      })
    )
    const i = 0
    done()
    // .set('Accept', 'application/json')
    // .expect('Content-Type', /json/)
    // .expect(200, done);
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
