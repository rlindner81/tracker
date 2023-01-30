import joi from "joi";

export const stepSchema = {
  values: joi.object(),
};

export default {
  options: {
    presence: "required",
  },
  body: joi.object().keys(stepSchema),
};
