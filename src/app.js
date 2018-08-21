"use strict"

process.env.TZ="Etc/UTC"

var express = require("express")
  , bodyParser = require("body-parser")
  , logger = require("./util").logger
  , error = require("./error")
  , route = require("./route")
  , app = express()
// , args = process.argv.slice(2)

if (process.env.NODE_ENV === "development") {
  logger.level = "debug"
  logger.debug("raised default log level to debug")
}

app.set("port", process.env.PORT || 8080)

app.disable("x-powered-by")
app.set("trust proxy", process.env.TRUST_PROXY || false)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api/tracker", route.tracker)

app.use(error.applicationErrorHandler)

var server
server = app.listen(app.get("port"), function () {
  logger.info("Started server on port " + app.get("port"))
})
server.on("error", function (err) {
  logger.error(err)
})
