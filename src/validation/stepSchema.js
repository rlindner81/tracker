"use strict"

var joi = require("joi"),
  stepSchema = {
    values: joi.object()
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(stepSchema)
}
