const session = require("express-session")
const Sessionstore = require("../session-store")(session)
const Datastore = require("@seald-io/nedb")
const Cursor = Datastore.prototype.find().constructor
const uuid = require("uuid").v4
const promisifyAll = require("../util").promisifyAll

const inMemoryOnly = process.env.NODE_ENV === "test"

Datastore.prototype.createNewId = uuid

promisifyAll(Datastore.prototype)
promisifyAll(Cursor.prototype)

module.exports = {
  sessions: new Sessionstore({ filename: "data/sessions.db", autoCompactInterval: null, inMemoryOnly }),
  users: new Datastore({ filename: "data/users.db", autoload: true, timestampData: true, inMemoryOnly }),
  tracks: new Datastore({ filename: "data/tracks.db", autoload: true, timestampData: true, inMemoryOnly }),
  steps: new Datastore({ filename: "data/steps.db", autoload: true, timestampData: true, inMemoryOnly }),
  reports: new Datastore({ filename: "data/reports.db", autoload: true, timestampData: true, inMemoryOnly }),
}
