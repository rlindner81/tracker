import joi from "joi";

export const string = joi.string().max(256);

export const stringNonEmpty = string.min(1);

export const token = stringNonEmpty.token();

export const stringId = stringNonEmpty.max(36).alphanum();

export const timestampSchema = {
  _seconds: joi.number().integer(),
  _nanoseconds: joi.number().integer(),
};
