"use strict"

var joi = require("joi")

module.exports = function (schema, req, res, next) {
  if (schema.body) {
    return joi.validate(req.body, schema.body, schema.options)
      .then(function (oResult) {
        // Write back changes made during the validation
        req.body = oResult
      })
      .then(next)
      .catch(function (err) {
        res.status(422).send(err.details[0].message)
      })
  }
  next()
}
