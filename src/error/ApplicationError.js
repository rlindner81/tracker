"use strict"

var util = require("util")

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
// https://stackoverflow.com/questions/8802845/inheriting-from-the-error-object-where-is-the-message-property
// NOTE: inheriting from Error is wrought with peril!
// I want to the stacktrace to be correct and I want instanceof to work.
function ApplicationError(status, defaultMessage) {
  var errorArgs = arguments.length === 2 ? [defaultMessage] : Array.prototype.slice.call(arguments, 2)
    , instance = Error.apply(null, errorArgs)

  Object.getOwnPropertyNames(instance).forEach(function (key) {
    if (key !== "stack") {
      this[key] = instance[key]
    }
  }.bind(this))

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, ApplicationError)
  }

  this.status = status || 500
  return this
}

util.inherits(ApplicationError, Error)

module.exports = ApplicationError
