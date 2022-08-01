const session = require("express-session")
const SessionStore = require("../session-store")(session)
const DataStore = require("@seald-io/nedb")
const uuid = require("uuid").v4

const inMemoryOnly = process.env.NODE_ENV === "test"

DataStore.prototype._createNewId = uuid

module.exports = {
  sessions: new SessionStore({ filename: "data/sessions.db", autoCompactInterval: null, inMemoryOnly }),
  users: new DataStore({ filename: "data/users.db", autoload: true, timestampData: true, inMemoryOnly }),
  tracks: new DataStore({ filename: "data/tracks.db", autoload: true, timestampData: true, inMemoryOnly }),
  steps: new DataStore({ filename: "data/steps.db", autoload: true, timestampData: true, inMemoryOnly }),
  reports: new DataStore({ filename: "data/reports.db", autoload: true, timestampData: true, inMemoryOnly }),
}
