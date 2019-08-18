"use strict"

var joi = require("@hapi/joi"),
  string = require("./common").string,
  trackSchema = {
    name: string
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(trackSchema)
}
