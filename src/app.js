"use strict"

process.env.TZ = "Etc/UTC"

var express = require("express")
  , session = require("express-session")
  , bodyParser = require("body-parser")
  , logger = require("./util").logger
  , uuid = require("uuid/v4")
  , error = require("./error")
  , dataService = require("./service").data
  , route = require("./route")
  , app = express()
  // , args = process.argv.slice(2)
  , sessionConfig = {
    store: dataService.sessions,
    genid: uuid,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "secret",
    cookie: {
      secure: process.env.SESSION_SECURE || false,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    }
  },
  server

if (process.env.NODE_ENV === "development") {
  logger.level = "debug"
  logger.debug("raised default log level to debug")
}

app.set("port", process.env.PORT || 8080)

app.disable("x-powered-by")
app.set("trust proxy", process.env.TRUST_PROXY || false)
app.use(session(sessionConfig))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api/tracker", route.tracker)

app.use(error.applicationErrorHandler)

server = app.listen(app.get("port"), function () {
  logger.info("Started server on port " + app.get("port"))
})
server.on("error", function (err) {
  logger.error(err)
})
