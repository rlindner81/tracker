"use strict"

var joi = require("@hapi/joi"),
  generatorSchema = {
    identifier: joi
      .string()
      .min(1)
      .max(256)
      .uppercase(),
    parameters: joi.object().optional()
  },
  typeSchema = {
    identifier: joi
      .string()
      .min(1)
      .max(256)
      .uppercase(),
    parameters: joi.object().optional()
  },
  fieldSchema = {
    position: joi
      .number()
      .integer()
      .min(0),
    key: joi
      .string()
      .min(1)
      .max(256),
    name: joi
      .string()
      .min(1)
      .max(256),
    input: joi.boolean().optional(),
    type: joi.alternatives().try(
      joi
        .string()
        .min(1)
        .max(256)
        .uppercase(),
      joi.object().keys(typeSchema)
    ),
    generator: joi.alternatives().try(
      joi
        .string()
        .min(1)
        .max(256)
        .uppercase(),
      joi.object().keys(generatorSchema)
    )
  },
  trackSchema = {
    name: joi
      .string()
      .min(1)
      .max(256),
    fields: joi.array().items(fieldSchema)
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(trackSchema)
}
