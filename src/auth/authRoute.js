"use strict"

var express = require("express")
  , service = require("./authService")
  , authHandler = require("./authHandler")
  , validation = require("../validation")
  , router = express.Router()


router.post("/login", validation.login, function (req, res, next) {
  service.login(req.session, req.body)
    .then(function () {
      res.send("Login successful")
    })
    .catch(next)
})

router.get("/logout", function (req, res, next) {
  service.logout(req.session)
    .then(function () {
      res.send("Logout successful")
    })
    .catch(next)
})

router.get("/me", authHandler, function (req, res, next) {
  service.readMe(req.session)
    .then(function (result) {
      res.json(result)
    })
    .catch(next)
})

module.exports = router
