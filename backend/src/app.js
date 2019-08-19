process.env.TZ = "Etc/UTC"

var express = require("express"),
  session = require("express-session"),
  bodyParser = require("body-parser"),
  auth = require("./auth"),
  error = require("./error"),
  dataService = require("./service").data,
  route = require("./route"),
  config = require("./config"),
  app = express(),
  sessionConfig = Object.assign({}, config.session, {
    store: dataService.sessions
  })

app.set("port", config.server.port)

app.disable("x-powered-by")
app.set("trust proxy", config.server.trustProxy)
app.use(session(sessionConfig))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api/auth", auth.route)
app.use("/api/track", auth.handler, route.track)

app.use(error.handler)

module.exports = app
