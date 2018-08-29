"use strict"

var factory = require("./factory")

module.exports.login = factory.bind(null, require("./loginSchema"))
module.exports.track = factory.bind(null, require("./trackSchema"))
module.exports.step = factory.bind(null, require("./stepSchema"))
