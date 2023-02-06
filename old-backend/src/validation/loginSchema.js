const joi = require("joi")
const { string } = require("./common")
const loginSchema = {
  nameOrEmail: string,
  password: string,
}

module.exports = {
  options: {
    presence: "required",
  },
  body: joi.object().keys(loginSchema),
}
