const joi = require("@hapi/joi")
const { string, token, fieldType, generatorType, inputType, displayType, frequencyType } = require("./common")
const typeSchema = {
  identifier: fieldType,
  parameters: joi.object()
}
const generatorSchema = {
  identifier: generatorType,
  parameters: joi.object()
}
const inputSchema = {
  identifier: inputType,
  parameters: joi.object()
}
const displaySchema = {
  identifier: displayType,
  parameters: joi.object()
}
const fieldSchema = {
  position: joi
    .number()
    .integer()
    .min(0),
  key: token,
  name: string,
  public: joi.boolean(),
  frequency: frequencyType,
  type: joi.alternatives().try(fieldType, joi.object().keys(typeSchema)),
  input: joi.alternatives().try(inputType, joi.object().keys(inputSchema)),
  generator: joi
    .alternatives()
    .try(generatorType, joi.object().keys(generatorSchema))
    ,
  display: joi
    .alternatives()
    .try(displayType, joi.object().keys(displaySchema))
    
}
const trackUpdateSchema = {
  name: string,
  fields: joi
    .array()
    .min(1)
    .items(fieldSchema)
}

module.exports = {
  options: {
    presence: "optional"
  },
  body: joi.object().keys(trackUpdateSchema)
}
