"use strict"

var session = require("express-session")
  , Sessionstore = require("nedb-session-store")(session)
  , Datastore = require("nedb")
  , promisifyAll = require("../util").promisifyAll

promisifyAll(Datastore.prototype)
promisifyAll(Sessionstore.prototype)

module.exports = {
  sessions: new Sessionstore({ filename: "data/sessions.db", autoload: true }),
  users: new Datastore({ filename: "data/users.db", autoload: true }),
  tracks: new Datastore({ filename: "data/tracks.db", autoload: true }),
  steps: new Datastore({ filename: "data/steps.db", autoload: true })
}
