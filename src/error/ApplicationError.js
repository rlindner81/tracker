"use strict"

var util = require("util")

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
// https://stackoverflow.com/questions/8802845/inheriting-from-the-error-object-where-is-the-message-property
function ApplicationError(status) {
  var instance = Error.apply(null, Array.prototype.slice.call(arguments, 1))

  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, ApplicationError)
  }

  instance.status = status || 500
  return instance
}

util.inherits(ApplicationError, Error)

module.exports = ApplicationError
