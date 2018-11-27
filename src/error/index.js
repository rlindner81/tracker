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
module.exports.UserNotFoundError = ApplicationError.bind(null, 401, "User not found")
module.exports.WrongPasswordError = ApplicationError.bind(null, 401, "Wrong password")
module.exports.MissingAuthenticationError = ApplicationError.bind(null, 401, "Missing authentication")
module.exports.MissingAuthorizationError = ApplicationError.bind(null, 403, "Missing authorization")
module.exports.AlreadyLoggedInError = ApplicationError.bind(null, 200, "Already logged in")
module.exports.AlreadyLoggedOutError = ApplicationError.bind(null, 200, "Already logged out")

/**
 * Track related errors
 */
module.exports.UnknownIdentifierError = ApplicationError.bind(null, 500, "Unknown identifier")
