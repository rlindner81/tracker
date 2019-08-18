"use strict"

var winston = require("winston"),
  logger = winston.createLogger({
    level: "info",
    format: winston.format.simple(),
    transports: [new winston.transports.Console()]
  })

module.exports = logger
