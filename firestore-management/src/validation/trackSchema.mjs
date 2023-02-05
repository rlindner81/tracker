import joi from "joi";
import {
  stringAllowEmpty,
  string,
  stringId,
  timestampSchema,
} from "./common.mjs";

const TRACK_TYPE = Object.freeze({
  PERSONAL: "PERSONAL",
  GROUP: "GROUP",
  OPEN: "OPEN",
});

const TRACK_FIELD_INPUT_CONTROL = Object.freeze({
  SELECT: "SELECT",
  SLIDER: "SLIDER",
  TEXT_FIELD: "TEXT_FIELD",
  DATETIME_PICKER: "DATETIME_PICKER",
});

const TRACK_FIELD_VALUE_TYPE = Object.freeze({
  STRING: "STRING",
  INTEGER: "INTEGER",
  FLOAT: "FLOAT",
  TIMESTAMP: "TIMESTAMP",
});

const trackType = joi.valid(...Object.values(TRACK_TYPE));

const trackFieldInputControl = joi.valid(
  ...Object.values(TRACK_FIELD_INPUT_CONTROL)
);

const trackFieldValueType = joi.valid(...Object.values(TRACK_FIELD_VALUE_TYPE));

const trackFieldBaseSchema = {
  key: string,
  name: string,
};

const trackFieldSelectChoiceSchema = {
  name: stringAllowEmpty,
  value: string,
};

const trackFieldSelectSchema = {
  ...trackFieldBaseSchema,
  input: TRACK_FIELD_INPUT_CONTROL.SELECT,
  type: joi.valid(
    TRACK_FIELD_VALUE_TYPE.STRING,
    TRACK_FIELD_VALUE_TYPE.INTEGER,
    TRACK_FIELD_VALUE_TYPE.FLOAT
  ),
  choices: joi.array().min(1).items(trackFieldSelectChoiceSchema),
  default_choice: joi.number().integer().min(-1),
};

const trackFieldSliderSchema = {
  ...trackFieldBaseSchema,
  input: TRACK_FIELD_INPUT_CONTROL.SLIDER,
  type: joi.valid(TRACK_FIELD_VALUE_TYPE.INTEGER, TRACK_FIELD_VALUE_TYPE.FLOAT),
  min: joi.number(),
  max: joi.number(),
  step: joi.number(),
};

const trackFieldTextSchema = {
  ...trackFieldBaseSchema,
  input: TRACK_FIELD_INPUT_CONTROL.TEXT_FIELD,
  type: joi.valid(
    TRACK_FIELD_VALUE_TYPE.STRING,
    TRACK_FIELD_VALUE_TYPE.INTEGER,
    TRACK_FIELD_VALUE_TYPE.FLOAT
  ),
};

const trackFieldDateTimeSchema = {
  ...trackFieldBaseSchema,
  input: TRACK_FIELD_INPUT_CONTROL.DATETIME_PICKER,
  type: TRACK_FIELD_VALUE_TYPE.TIMESTAMP,
};

const trackField = joi.alternatives(
  trackFieldSelectSchema,
  trackFieldSliderSchema,
  trackFieldTextSchema,
  trackFieldDateTimeSchema
);

const trackBaseSchema = {
  _created_at: timestampSchema,
  _created_by: stringId,
  _updated_at: timestampSchema,
  _updated_by: stringId,
  owner_id: stringId,
  step_count: joi.number().optional(),
  name: string,
  fields: joi.array().min(1).items(trackField),
};

const trackPersonalSchema = {
  ...trackBaseSchema,
  type: TRACK_TYPE.PERSONAL,
};

const trackGroupSchema = {
  ...trackBaseSchema,
  type: TRACK_TYPE.GROUP,
  members: joi.array().min(1).items(stringId),
};

const trackOpenSchema = {
  ...trackBaseSchema,
  type: TRACK_TYPE.OPEN,
};

const trackEntity = joi.alternatives(
  trackPersonalSchema,
  trackGroupSchema,
  trackOpenSchema
);

export default {
  options: {
    presence: "required",
  },
  body: trackEntity,
};
