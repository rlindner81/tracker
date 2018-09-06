"use strict"

var joi = require("joi")
  , generatorSchema = {
    type: joi.string().min(1).max(256).uppercase(),
    parameters: joi.object().optional()
  }
  , fieldSchema = {
    key: joi.string().min(1).max(256),
    name: joi.string().min(1).max(256),
    editable: joi.boolean(),
    generator: joi.object().keys(generatorSchema),
    formatter: joi.string().min(1).max(256).uppercase().optional()
  }
  , trackSchema = {
    _id: joi.string().uuid(),
    name: joi.string().min(1).max(256),
    fields: joi.array().items(fieldSchema).min(1)
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(trackSchema)
}
