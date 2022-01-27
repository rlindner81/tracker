const { promisify } = require("util")
const bcrypt = require("bcrypt")
const dbUsers = require("../service").data.users
const error = require("../error")
const AlreadyLoggedInError = error.AlreadyLoggedInError
const AlreadyLoggedOutError = error.AlreadyLoggedOutError
const UserNotFoundError = error.UserNotFoundError
const UserAlreadyExistsError = error.UserAlreadyExistsError
const WrongPasswordError = error.WrongPasswordError

function isLoggedIn(session) {
  return session.userId !== undefined
}
module.exports.isLoggedIn = isLoggedIn

function login(session, fields) {
  let user
  if (isLoggedIn(session)) {
    throw new AlreadyLoggedInError()
  }

  return dbUsers
    .findOneAsync({ $or: [{ name: fields.nameOrEmail }, { email: fields.nameOrEmail }] })
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
      session.userId = user["_id"]
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

function register(session, fields) {
  let user = fields
  if (isLoggedIn(session)) {
    throw new AlreadyLoggedInError()
  }

  return dbUsers
    .findOneAsync({ $or: [{ name: user.name }, { email: user.email }] })
    .then(function (dbUser) {
      if (dbUser !== null) {
        throw new UserAlreadyExistsError(`User already exists name: ${dbUser.name} email: ${dbUser.email}`)
      }
      return promisify(bcrypt.hash)(user.password, 10)
    })
    .then((password) => {
      user.password = password
      return dbUsers.insertAsync(user)
    })
    .then(cleanPassword)
}
module.exports.register = register

function readMe(session) {
  return dbUsers.findOneAsync({ _id: session.userId }).then(cleanPassword)
}
module.exports.readMe = readMe

function cleanPassword(user) {
  delete user.password
  return user
}
