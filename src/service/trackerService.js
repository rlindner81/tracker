"use strict"

var uuidv4 = require("uuid/v4")
  , logger = require("../util").logger
  , db = require("./dataService")

function getUsers() {
  return db.users.findAsync({})
}
module.exports.getUsers = getUsers

function addUser(user) {
  logger.info("user:", user)
  return db.users.insertAsync(user)
}
module.exports.addUser = addUser
