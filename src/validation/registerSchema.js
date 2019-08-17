"use strict"

var joi = require("@hapi/joi"),
  registerSchema = {
    name: joi
      .string()
      .min(1)
      .max(256),
    email: joi
      .string()
      .min(1)
      .max(256),
    password: joi
      .string()
      .alphanum()
      .min(1)
      .max(256)
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(registerSchema)
}
