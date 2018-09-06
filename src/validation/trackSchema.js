"use strict"

var joi = require("joi")
  , generatorSchema = {
    type: joi.string().min(1).max(256).uppercase(),
    parameters: joi.object().optional()
  }
  , fieldSchema = {
    position: joi.number().integer().min(0),
    key: joi.string().min(1).max(256),
    name: joi.string().min(1).max(256),
    generator: joi.object().keys(generatorSchema)
  }
  , trackSchema = {
    name: joi.string().min(1).max(256),
    inputFields: joi.array().items(fieldSchema).min(1),
    computedFields: joi.array().items(fieldSchema).min(1)
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(trackSchema)
}
