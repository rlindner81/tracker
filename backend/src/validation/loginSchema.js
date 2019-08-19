"use strict"

var joi = require("@hapi/joi"),
  string = require("./common").string,
  loginSchema = {
    nameOrEmail: string,
    password: string
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(loginSchema)
}