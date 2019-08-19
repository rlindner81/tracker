"use strict"

var joi = require("@hapi/joi"),
  string = joi
    .string()
    .min(1)
    .max(256),
  alphanum = string.alphanum(),
  token = string.token(),
  fieldType = joi.string().valid("INPUT", "TEXT", "INTEGER", "FLOAT", "TIME"),
  generatorType = joi.string().valid("STATIC", "TIME_NOW", "TIME_RELATIVE_PREVIOUS"),
  inputType = token.uppercase(), // joi.string().valid("FIELD", "SELECT"),
  displayType = token.uppercase(), // joi.string().valid("CURRENCY"),
  frequencyType = joi.string().valid("YEAR", "MONTH", "WEEK", "DAY", "HOUR", "MINUTE", "SECOND")

module.exports = {
  string,
  alphanum,
  token,
  fieldType,
  generatorType,
  inputType,
  displayType,
  frequencyType
}
