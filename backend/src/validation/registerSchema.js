const joi = require("@hapi/joi")
const { string } = require("./common")
const registerSchema = {
  name: string,
  email: string.email(),
  password: string
}

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(registerSchema)
}
