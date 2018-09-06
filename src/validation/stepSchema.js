"use strict"

var joi = require("joi")
  , valueSchema = joi.string().min(1).max(256)
  , stepSchema = {
    _id: joi.string().uuid().optional(),
    trackId: joi.string().uuid().optional(),
    userId: joi.string().uuid().optional(),
    values: joi.array().items(valueSchema).min(1)
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(stepSchema)
}
