const app = require("./app")
const logger = require("./util").logger

if (process.env.NODE_ENV === "development") {
  logger.level = "debug"
  logger.debug("raised default log level to debug")
}

const server = app.listen(app.get("port"), function() {
  logger.info("Started server on port " + app.get("port"))
})
server.on("error", function(err) {
  logger.error(err)
})

module.exports = server
