"use strict"

var joi = require("@hapi/joi"),
  string = require("./common").string,
  alphanum = require("./common").alphanum,
  fieldType = joi.string().valid("TEXT", "NUMBER", "TIME", "SELECT_SINGLE"),
  generatorType = joi.string().valid("STATIC", "TIME_NOW", "TIME_RELATIVE_PREVIOUS"),
  generatorSchema = {
    identifier: generatorType,
    parameters: joi.object().optional()
  },
  typeSchema = {
    identifier: fieldType,
    parameters: joi.object().optional()
  },
  fieldSchema = {
    position: joi
      .number()
      .integer()
      .min(0),
    key: alphanum,
    name: string,
    input: joi.boolean().optional(),
    type: joi.alternatives().try(fieldType, joi.object().keys(typeSchema)),
    generator: joi.alternatives().try(generatorType, joi.object().keys(generatorSchema))
  },
  trackSchema = {
    name: string,
    fields: joi
      .array()
      .min(1)
      .items(fieldSchema)
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(trackSchema)
}
