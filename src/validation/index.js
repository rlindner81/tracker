"use strict"

var factory = require("./factory")

module.exports.login = factory.bind(null, require("./loginSchema"))
module.exports.test = factory.bind(null, require("./testSchema"))
