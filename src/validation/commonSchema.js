"use strict"

var joi = require("@hapi/joi"),
  string = joi
    .string()
    .min(1)
    .max(256),
  alphanum = string.alphanum()

module.exports = {
  string,
  alphanum
}
