"use strict"

var joi = require("joi")

module.exports = function (schema, req, res, next) {
  if (schema.body) {
    return joi.validate(req.body, schema.body, schema.options)
      // NOTE: this anonymous function is needed so the output of validate is not passed into next
      .then(function () {
        next()
      })
      .catch(function (err) {
        res.status(422).send(err.details[0].message)
      })
  }
  next()
}
