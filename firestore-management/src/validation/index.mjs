import trackSchema from "./trackSchema.mjs";
import stepSchema from "./stepSchema.mjs";

const validate = async (schema, data) =>
  await schema.body.validateAsync(data, schema.options);

export const validateTrack = async (track) =>
  await validate(trackSchema, track);

export const validateStep = async (step) => await validate(stepSchema, step);
