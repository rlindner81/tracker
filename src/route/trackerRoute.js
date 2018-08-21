"use strict"

var express = require("express")
  , validation = require("../validation")
  , service = require("../service").tracker
  , router = express.Router()

router.get("/id", function (req, res, next) {
  return service.getId()
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

router.post("/test", validation.test, function (req, res, next) {
  return service.test(req.body)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

module.exports = router
