import joi from "joi";

export const string = joi.string().max(256);

export const stringNonEmpty = string.min(1);

export const token = stringNonEmpty.token();

export const fieldType = joi
  .string()
  .valid("INPUT", "TEXT", "INTEGER", "FLOAT", "TIME");

export const generatorType = joi
  .string()
  .valid("STATIC", "TIME_NOW", "TIME_RELATIVE_PREVIOUS");

export const inputType = token.uppercase(); // joi.string().valid("FIELD", "SELECT")

export const displayType = token.uppercase(); // joi.string().valid("CURRENCY")

export const frequencyType = joi
  .string()
  .valid("YEAR", "MONTH", "WEEK", "DAY", "HOUR", "MINUTE", "SECOND");

export const sharingType = joi.string().valid("PERSONAL", "GROUP", "OPEN");
