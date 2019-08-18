"use strict"

var session = require("express-session"),
  Sessionstore = require("nedb-session-store")(session),
  Datastore = require("nedb"),
  Cursor = Datastore.prototype.find().constructor,
  uuid = require("uuid/v4"),
  promisifyAll = require("../util").promisifyAll

const inMemoryOnly = process.env.NODE_ENV === "test" ? true : false

Datastore.prototype.createNewId = uuid

promisifyAll(Datastore.prototype)
promisifyAll(Cursor.prototype)

module.exports = {
  sessions: new Sessionstore({ filename: "data/sessions.db", autoCompactInterval: null, inMemoryOnly }),
  users: new Datastore({ filename: "data/users.db", autoload: true, timestampData: true, inMemoryOnly }),
  tracks: new Datastore({ filename: "data/tracks.db", autoload: true, timestampData: true, inMemoryOnly }),
  steps: new Datastore({ filename: "data/steps.db", autoload: true, timestampData: true, inMemoryOnly })
}
