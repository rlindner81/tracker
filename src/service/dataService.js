"use strict"

var promisifyAll = require("../util").promisifyAll
  , Datastore = require("nedb")

promisifyAll(Datastore.prototype)

module.exports = {
  users: new Datastore({ filename: "data/users.db", autoload: true }),
  trackers: new Datastore({ filename: "data/trackers.db", autoload: true })
}
