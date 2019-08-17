"use strict"

var joi = require("@hapi/joi"),
  alphanum = require("./commonSchema").alphanum,
  registerSchema = {
    name: alphanum,
    email: alphanum,
    password: alphanum
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(registerSchema)
}
