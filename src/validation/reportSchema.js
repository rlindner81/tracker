"use strict"

var joi = require("@hapi/joi"),
  fieldKey = joi
    .string()
    .min(1)
    .max(256),
  aggregationSchema = joi.alternatives().try(
    {
      key: fieldKey,
      type: joi.string().valid("COUNT")
    },
    {
      key: fieldKey,
      type: joi.string().valid("MIN", "MAX", "AVG", "SUM"),
      field: fieldKey
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
