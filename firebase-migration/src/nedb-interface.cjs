const pathlib = require("path");
const DataStore = require("@seald-io/nedb");

const DATA_DIR = pathlib.join(__dirname, "../../../backend/data");

module.exports = {
  users: new DataStore({ filename: pathlib.join(DATA_DIR, "users.db"), autoload: true, timestampData: true }),
  tracks: new DataStore({ filename: pathlib.join(DATA_DIR, "tracks.db"), autoload: true, timestampData: true }),
  steps: new DataStore({ filename: pathlib.join(DATA_DIR, "steps.db"), autoload: true, timestampData: true }),
}
