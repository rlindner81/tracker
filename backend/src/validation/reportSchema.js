"use strict"

var joi = require("@hapi/joi"),
  token = require("./common").token,
  aggregationSchema = joi.alternatives().try(
    {
      key: token,
      type: joi.string().valid("COUNT")
    },
    {
      key: token,
      type: joi.string().valid("MIN", "MAX", "AVG", "SUM"),
      field: token
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
