import joi from "joi";

export const string = joi.string().max(256);

export const stringAllowEmpty = string.allow("");

export const stringId = string.max(36).alphanum();

export const timestampSchema = {
  _seconds: joi.number().integer(),
  _nanoseconds: joi.number().integer(),
};
