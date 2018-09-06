"use strict"

var joi = require("joi")
  , valueSchema = joi.string().min(1).max(256)
  , stepSchema = {
    _id: joi.string().uuid(),
    trackId: joi.string().uuid(),
    values: joi.array().items(valueSchema).min(1)
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(stepSchema)
}
