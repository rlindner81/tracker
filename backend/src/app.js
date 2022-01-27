process.env.TZ = "Etc/UTC"

const express = require("express")
const session = require("express-session")
const bodyParser = require("body-parser")
const auth = require("./auth")
const error = require("./error")
const dataService = require("./service").data
const route = require("./route")
const config = require("./config")
const app = express()
const sessionConfig = Object.assign({}, config.session, {
  store: dataService.sessions,
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
