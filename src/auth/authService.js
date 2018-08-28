"use strict"

var bcrypt = require("bcrypt")
  , promisify = require("util").promisify
  , dbUsers = require("../service").data.users
  , error = require("../error")


function isLoggedIn(session) {
  return session.userId !== undefined
}
module.exports.isLoggedIn = isLoggedIn

function login(session, fields) {
  var user
  if (isLoggedIn(session)) {
    return Promise.reject(new error.AlreadyLoggedIn())
  }

  return dbUsers.findOneAsync({ $or: [{ name: fields.nameOrEmail }, { email: fields.nameOrEmail }]})
    .then(function (dbUser) {
      if (dbUser === null) {
        return Promise.reject(new error.UserNotFound())
      }
      user = dbUser
      return bcrypt.compare(fields.password, user.password)
    })
    .then(function (match) {
      if (!match) {
        return Promise.reject(new error.WrongPassword())
      }
      session.userId = user.id
    })
    .catch(function (err) {
      delete session.userId
      return Promise.reject(err)
    })
}
module.exports.login = login

function logout(session) {
  if (!isLoggedIn(session)) {
    return Promise.reject(new error.AlreadyLoggedOut())
  }
  return promisify(session.destroy.bind(session))()
}
module.exports.logout = logout

function readMe(session) {
  return dbUsers.findAsync({ "id": session.userId })
}
module.exports.readMe = readMe
