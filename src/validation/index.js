"use strict"

var factory = require("./factory")

module.exports.test = factory.bind(null, require("./testSchema"))
