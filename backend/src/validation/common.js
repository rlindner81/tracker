const joi = require("joi")
const string = joi.string().max(256)
const stringNonEmpty = string.min(1)
const token = stringNonEmpty.token()
const fieldType = joi.string().valid("INPUT", "TEXT", "INTEGER", "FLOAT", "TIME")
const generatorType = joi.string().valid("STATIC", "TIME_NOW", "TIME_RELATIVE_PREVIOUS")
const inputType = token.uppercase() // joi.string().valid("FIELD", "SELECT")
const displayType = token.uppercase() // joi.string().valid("CURRENCY")
const frequencyType = joi.string().valid("YEAR", "MONTH", "WEEK", "DAY", "HOUR", "MINUTE", "SECOND")
const sharingType = joi.string().valid("PERSONAL", "GROUP", "OPEN")

module.exports = {
  string,
  stringNonEmpty,
  token,
  fieldType,
  generatorType,
  inputType,
  displayType,
  frequencyType,
  sharingType
}
