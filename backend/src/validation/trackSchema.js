const joi = require("joi")
const {
  string,
  token,
  fieldType,
  generatorType,
  inputType,
  displayType,
  frequencyType,
  sharingType,
} = require("./common")
const typeSchema = {
  identifier: fieldType,
  parameters: joi.object().optional(),
}
const generatorSchema = {
  identifier: generatorType,
  parameters: joi.object().optional(),
}
const inputSchema = {
  identifier: inputType,
  parameters: joi.object().optional(),
}
const displaySchema = {
  identifier: displayType,
  parameters: joi.object().optional(),
}
const fieldSchema = {
  position: joi.number().integer().min(0),
  key: token,
  name: string,
  optional: joi.boolean().optional(),
  type: joi.alternatives().try(fieldType, joi.object().keys(typeSchema)),
  input: joi.alternatives().try(inputType, joi.object().keys(inputSchema)),
  generator: joi.alternatives().try(generatorType, joi.object().keys(generatorSchema)).optional(),
  display: joi.alternatives().try(displayType, joi.object().keys(displaySchema)).optional(),
}
const trackSchema = {
  name: string,
  sharing: sharingType.optional(),
  frequency: frequencyType.optional(),
  fields: joi.array().min(1).items(fieldSchema),
}

module.exports = {
  options: {
    presence: "required",
  },
  body: joi.object().keys(trackSchema),
}
