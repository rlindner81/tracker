"use strict"

var Joi = require("joi")

module.exports = function (schema, req, res, next) {
  if (schema.body) {
    return Joi.validate(req.body, schema.body)
      // TODO why not .then(next) ???
      .then(function () {
        next()
      })
      .catch(function (err) {
        res.status(422).send(err.details[0].message)
      })
  }
  next()
}
