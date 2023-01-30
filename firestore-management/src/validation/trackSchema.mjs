import joi from "joi";
import {
  string,
  token,
  fieldType,
  generatorType,
  inputType,
  displayType,
  frequencyType,
  sharingType,
} from "./common.mjs";

export const typeSchema = {
  identifier: fieldType,
  parameters: joi.object().optional(),
};

export const generatorSchema = {
  identifier: generatorType,
  parameters: joi.object().optional(),
};

export const inputSchema = {
  identifier: inputType,
  parameters: joi.object().optional(),
};

export const displaySchema = {
  identifier: displayType,
  parameters: joi.object().optional(),
};

export const fieldSchema = {
  position: joi.number().integer().min(0),
  key: token,
  name: string,
  optional: joi.boolean().optional(),
  type: joi.alternatives().try(fieldType, joi.object().keys(typeSchema)),
  input: joi.alternatives().try(inputType, joi.object().keys(inputSchema)),
  generator: joi
    .alternatives()
    .try(generatorType, joi.object().keys(generatorSchema))
    .optional(),
  display: joi
    .alternatives()
    .try(displayType, joi.object().keys(displaySchema))
    .optional(),
};

export const trackSchema = {
  name: string,
  sharing: sharingType.optional(),
  frequency: frequencyType.optional(),
  fields: joi.array().min(1).items(fieldSchema),
};

export default {
  options: {
    presence: "required",
  },
  body: joi.object().keys(trackSchema),
};
