"use strict"

process.env.TZ = "Etc/UTC"

var express = require("express")
  , session = require("express-session")
  , bodyParser = require("body-parser")
  , logger = require("./util").logger
  , auth = require("./auth")
  , error = require("./error")
  , dataService = require("./service").data
  , route = require("./route")
  , config = require("./config")
  , app = express()
  , sessionConfig = Object.assign({}, config.session, {
    store: dataService.sessions
  }),
  server

if (process.env.NODE_ENV === "development") {
  logger.level = "debug"
  logger.debug("raised default log level to debug")
}

app.set("port", config.server.port)

app.disable("x-powered-by")
app.set("trust proxy", config.server.trustProxy)
app.use(session(sessionConfig))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api/auth", auth.route)
app.use("/api/track", auth.handler, route.track)

app.use(error.handler)

server = app.listen(app.get("port"), function () {
  logger.info("Started server on port " + app.get("port"))
})
server.on("error", function (err) {
  logger.error(err)
})
