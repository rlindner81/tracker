"use strict"

const joi = require("@hapi/joi")
const { string, token, fieldType, generatorType, inputType, displayType, frequencyType } = require("./common")
const typeSchema = {
    identifier: fieldType,
    parameters: joi.object().optional()
  },
  generatorSchema = {
    identifier: generatorType,
    parameters: joi.object().optional()
  },
  inputSchema = {
    identifier: inputType,
    parameters: joi.object().optional()
  },
  displaySchema = {
    identifier: displayType,
    parameters: joi.object().optional()
  },
  fieldSchema = {
    position: joi
      .number()
      .integer()
      .min(0),
    key: token,
    name: string,
    public: joi.boolean().optional(),
    frequency: frequencyType.optional(),
    type: joi.alternatives().try(fieldType, joi.object().keys(typeSchema)),
    generator: joi.alternatives().try(generatorType, joi.object().keys(generatorSchema)),
    input: joi
      .alternatives()
      .try(inputType, joi.object().keys(inputSchema))
      .optional(),
    display: joi
      .alternatives()
      .try(displayType, joi.object().keys(displaySchema))
      .optional()
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
