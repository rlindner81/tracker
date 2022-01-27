const express = require("express")
const service = require("./authService")
const authHandler = require("./authHandler")
const validation = require("../validation")
const router = express.Router()

router.post("/login", validation.login, function (req, res, next) {
  service
    .login(req.session, req.body)
    .then(function () {
      res.send("Login successful")
    })
    .catch(next)
})

router.post("/logout", function (req, res, next) {
  service
    .logout(req.session)
    .then(function () {
      res.send("Logout successful")
    })
    .catch(next)
})

router.post("/register", validation.register, function (req, res, next) {
  service
    .register(req.session, req.body)
    .then(function (result) {
      res.json(result)
    })
    .catch(next)
})

router.get("/me", authHandler, function (req, res, next) {
  service
    .readMe(req.session)
    .then(function (result) {
      res.json(result)
    })
    .catch(next)
})

module.exports = router
