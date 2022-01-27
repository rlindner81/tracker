const joi = require("joi")
const stepSchema = {
  values: joi.object(),
}

module.exports = {
  options: {
    presence: "required",
  },
  body: joi.object().keys(stepSchema),
}
