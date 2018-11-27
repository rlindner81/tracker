"use strict"

var bcrypt = require("bcrypt")
  , promisify = require("util").promisify
  , dbUsers = require("../service").data.users
  , error = require("../error")
  , AlreadyLoggedInError = error.AlreadyLoggedInError
  , AlreadyLoggedOutError = error.AlreadyLoggedOutError
  , UserNotFoundError = error.UserNotFoundError
  , WrongPasswordError = error.WrongPasswordError


function isLoggedIn(session) {
  return session.userId !== undefined
}
module.exports.isLoggedIn = isLoggedIn

function login(session, fields) {
  var user
  if (isLoggedIn(session)) {
    throw new AlreadyLoggedInError()
  }

  return dbUsers.findOneAsync({ $or: [{ name: fields.nameOrEmail }, { email: fields.nameOrEmail }]})
    .then(function (dbUser) {
      if (dbUser === null) {
        throw new UserNotFoundError()
      }
      user = dbUser
      return bcrypt.compare(fields.password, user.password)
    })
    .then(function (match) {
      if (!match) {
        throw new WrongPasswordError()
      }
      session.userId = user._id
    })
    .catch(function (err) {
      delete session.userId
      throw err
    })
}
module.exports.login = login

function logout(session) {
  if (!isLoggedIn(session)) {
    throw new AlreadyLoggedOutError()
  }
  return promisify(session.destroy.bind(session))()
}
module.exports.logout = logout

function readMe(session) {
  return dbUsers.findOneAsync({ "_id": session.userId })
}
module.exports.readMe = readMe
