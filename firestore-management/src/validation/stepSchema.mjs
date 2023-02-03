import joi from "joi";
import { string, stringId, timestampSchema } from "./common.mjs";

const stepSchema = {
  _created_at: timestampSchema,
  _created_by: stringId,
  _updated_at: timestampSchema,
  _updated_by: stringId,
  track_id: stringId,
  posted_at: timestampSchema,
  posted_by: stringId,
  values: joi.object().pattern(/.*/, [string, joi.number()]),
};

export default {
  options: {
    presence: "required",
  },
  body: joi.object().keys(stepSchema),
};
