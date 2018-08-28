"use strict"

var Joi = require("joi")

module.exports.body = Joi.object().keys({
  nameOrEmail: Joi.string().min(1).max(256).required(),
  password: Joi.string().alphanum().min(1).max(256).required()
})
