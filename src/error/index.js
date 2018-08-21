"use strict"

var ApplicationError = require("./ApplicationError")

module.exports.ApplicationError = ApplicationError
module.exports.applicationErrorHandler = require("./applicationErrorHandler")
module.exports.notImplementedError = new ApplicationError(500, "Not implemented error")
module.exports.userInvalidError = new ApplicationError(422, "User is invalid")
module.exports.tokenInvalidError = new ApplicationError(422, "Token is invalid")
module.exports.verificationFailedError = new ApplicationError(422, "Verification failed")
