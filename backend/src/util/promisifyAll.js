const promisify = require("util").promisify
const suffix = "Async"

function promisifyAll(target) {
  Object.getOwnPropertyNames(target)
    .filter((name) => name !== "constructor" && name.length > 0 && name.slice(0, 1) !== "_")
    .forEach((name) => {
      target[name + suffix] = promisify(target[name])
    })
}

module.exports = promisifyAll
