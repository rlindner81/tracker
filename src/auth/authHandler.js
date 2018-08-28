"use strict"

var authService = require("./authService")
  , error = require("../error")

module.exports = function (req, res, next) {
  next(authService.isLoggedIn(req.session) ? undefined : new error.MissingAuthentication())
}
