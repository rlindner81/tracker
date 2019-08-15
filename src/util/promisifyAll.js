"use strict"

var promisify = require("util").promisify,
  suffix = "Async"

function promisifyAll(target) {
  Object.keys(target).forEach(function(name) {
    if (name.length > 0 && name.slice(0, 1) !== "_") {
      target[name + suffix] = promisify(target[name])
    }
  })
}

module.exports = promisifyAll
