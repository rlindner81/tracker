const joi = require("joi")
const { string, token, frequencyType } = require("./common")
const aggregationSchema = joi.alternatives().try(
  {
    key: token,
    type: joi.string().valid("COUNT")
  },
  {
    key: token,
    type: joi.string().valid("MIN", "MAX", "AVG", "SUM"),
    field: token
  }
)
const reportSchema = {
  name: string.optional(),
  aggregations: joi
    .array()
    .min(1)
    .items(aggregationSchema),
  interval: frequencyType
}

module.exports = {
  options: {
    presence: "required"
  },
  body: joi.object().keys(reportSchema)
}
