"use strict"

var session = require("express-session")
  , Sessionstore = require("nedb-session-store")(session)
  , Datastore = require("nedb")
  , promisifyAll = require("../util").promisifyAll

promisifyAll(Datastore.prototype)
promisifyAll(Sessionstore.prototype)

module.exports = {
  users: new Datastore({ filename: "data/users.db", autoload: true }),
  trackers: new Datastore({ filename: "data/trackers.db", autoload: true }),
  tracks: new Datastore({ filename: "data/tracks.db", autoload: true }),
  sessions: new Sessionstore({ filename: "data/sessions.db", autoload: true })
}
