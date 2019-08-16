"use strict"

var joi = require("@hapi/joi"),
  stepSchema = {
    values: joi.object()
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(stepSchema)
}
