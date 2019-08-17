"use strict"

var joi = require("@hapi/joi"),
  alphanum = joi
    .string()
    .alphanum()
    .min(1)
    .max(256)

module.exports = {
  alphanum
}
