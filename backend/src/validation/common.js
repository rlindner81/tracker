const joi = require("@hapi/joi")
const string = joi
  .string()
  .min(1)
  .max(256)
const alphanum = string.alphanum()
const token = string.token()
const fieldType = joi.string().valid("INPUT", "TEXT", "INTEGER", "FLOAT", "TIME")
const generatorType = joi.string().valid("STATIC", "TIME_NOW", "TIME_RELATIVE_PREVIOUS")
const inputType = token.uppercase() // joi.string().valid("FIELD", "SELECT")
const displayType = token.uppercase() // joi.string().valid("CURRENCY")
const frequencyType = joi.string().valid("YEAR", "MONTH", "WEEK", "DAY", "HOUR", "MINUTE", "SECOND")

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
