"use strict"

var joi = require("joi")
  , loginSchema = {
    nameOrEmail: joi.string().min(1).max(256),
    password: joi.string().alphanum().min(1).max(256)
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(loginSchema)
}
