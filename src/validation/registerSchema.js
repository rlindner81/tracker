"use strict"

var joi = require("@hapi/joi"),
  string = require("./commonSchema").string,
  registerSchema = {
    name: string,
    email: string.email(),
    password: string
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(registerSchema)
}
