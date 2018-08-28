"use strict"

var ApplicationError = require("./ApplicationError")

module.exports.handler = require("./applicationErrorHandler")

/**
 * Common errors
 */
module.exports.NotImplementedError = ApplicationError.bind(null, 500, "Not implemented error")
module.exports.VerificationFailedError = ApplicationError.bind(null, 422, "Verification failed")

/**
 * Authentication related errors
 */
module.exports.UserNotFound = ApplicationError.bind(null, 401, "User not found")
module.exports.WrongPassword = ApplicationError.bind(null, 401, "Wrong password")
module.exports.MissingAuthentication = ApplicationError.bind(null, 401, "Missing authentication")
module.exports.MissingAuthorization = ApplicationError.bind(null, 403, "Missing authorization")
module.exports.AlreadyLoggedIn = ApplicationError.bind(null, 200, "Already logged in")
module.exports.AlreadyLoggedOut = ApplicationError.bind(null, 200, "Already logged out")
