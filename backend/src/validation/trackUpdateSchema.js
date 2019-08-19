const joi = require("@hapi/joi")
const { string } = require("./common")
const trackUpdateSchema = {
  name: string,
  public: joi.boolean().optional(),
  frequency: frequencyType.optional()
}

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(trackUpdateSchema)
}
