const joi = require("@hapi/joi")
const { string } = require("./common")
const trackSchema = {
  name: string
}

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(trackSchema)
}
