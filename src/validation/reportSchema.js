"use strict"

var joi = require("@hapi/joi"),
  alphanum = require("./commonSchema").alphanum,
  aggregationSchema = joi.alternatives().try(
    {
      key: alphanum,
      type: joi.string().valid("COUNT")
    },
    {
      key: alphanum,
      type: joi.string().valid("MIN", "MAX", "AVG", "SUM"),
      field: alphanum
    }
  ),
  reportSchema = {
    aggregations: joi
      .array()
      .min(1)
      .items(aggregationSchema),
    interval: joi.string().valid("YEAR", "MONTH", "WEEK", "DAY", "HOUR", "MINUTE", "SECOND")
  }

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(reportSchema)
}
