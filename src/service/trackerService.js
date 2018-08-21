"use strict"

var uuidv4 = require("uuid/v4")

function getId() {
  return Promise.resolve({ "id": uuidv4() })
}
module.exports.getId = getId
