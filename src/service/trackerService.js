"use strict"

var uuidv4 = require("uuid/v4")
  , logger = require("../util").logger

function getId() {
  return Promise.resolve({ "id": uuidv4() })
}
module.exports.getId = getId

function test(body) {
  logger.info("", body)
  return Promise.resolve()
}
module.exports.test = test
