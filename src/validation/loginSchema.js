"use strict"

var joi = require("@hapi/joi"),
  alphanum = require("./commonSchema").alphanum,
  loginSchema = {
    nameOrEmail: alphanum,
    password: alphanum
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(loginSchema)
}
