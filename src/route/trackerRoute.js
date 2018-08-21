"use strict"

var express = require("express")
  , validation = require("../validation")
  , service = require("../service").tracker
  , router = express.Router()

router.get("/users", function (req, res, next) {
  return service.getUsers()
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

router.post("/user", validation.test, function (req, res, next) {
  return service.addUser(req.body)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

module.exports = router
