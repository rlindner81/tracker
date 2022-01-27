const authService = require("./authService")
const error = require("../error")
const MissingAuthenticationError = error.MissingAuthenticationError

module.exports = function (req, res, next) {
  next(authService.isLoggedIn(req.session) ? undefined : new MissingAuthenticationError())
}
