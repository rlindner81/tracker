"use strict"

var session = require("express-session")
  , Sessionstore = require("nedb-session-store")(session)
  , Datastore = require("nedb")
  , uuid = require("uuid/v4")
  , promisifyAll = require("../util").promisifyAll

Datastore.prototype.createNewId = uuid

promisifyAll(Datastore.prototype)

module.exports = {
  sessions: new Sessionstore({ filename: "data/sessions.db" }),
  users: new Datastore({ filename: "data/users.db", autoload: true, timestampData: true }),
  tracks: new Datastore({ filename: "data/tracks.db", autoload: true, timestampData: true }),
  steps: new Datastore({ filename: "data/steps.db", autoload: true, timestampData: true })
}
