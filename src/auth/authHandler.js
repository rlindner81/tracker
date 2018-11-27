"use strict"

var authService = require("./authService")
  , error = require("../error")
  , MissingAuthenticationError = error.MissingAuthenticationError

module.exports = function (req, res, next) {
  next(authService.isLoggedIn(req.session) ? undefined : new MissingAuthenticationError())
}
