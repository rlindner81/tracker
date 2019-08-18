"use strict"

var express = require("express"),
  validation = require("../validation"),
  service = require("../service").track,
  router = express.Router()

/**
 * Tracks
 */

router.get("/", function(req, res, next) {
  return service
    .getTracks(req.session)
    .then(function(data) {
      res.json(data)
    })
    .catch(next)
})

router.post("/", validation.track, function(req, res, next) {
  return service
    .addTrack(req.session, req.body)
    .then(function(data) {
      res.json(data)
    })
    .catch(next)
})

router.patch("/:trackId", validation.trackUpdate, function(req, res, next) {
  return service
    .updateTrack(req.session, req.params.trackId, req.body)
    .then(function(data) {
      res.json(data)
    })
    .catch(next)
})

router.delete("/:trackId", function(req, res, next) {
  return service
    .deleteTrack(req.session, req.params.trackId)
    .then(function(data) {
      res.json(data)
    })
    .catch(next)
})

/**
 * Steps
 */

router.get("/:trackId/step", function(req, res, next) {
  return service
    .getSteps(req.session, req.params.trackId)
    .then(function(data) {
      res.json(data)
    })
    .catch(next)
})

router.get("/:trackId/step/paged", function(req, res, next) {
  return service
    .getStepsPaged(req.session, req.params.trackId, req.query)
    .then(function(data) {
      res.json(data)
    })
    .catch(next)
})

router.post("/:trackId/step", validation.step, function(req, res, next) {
  return service
    .addStep(req.session, req.params.trackId, req.body)
    .then(function(data) {
      res.json(data)
    })
    .catch(next)
  })

router.delete("/:trackId/step/:stepId", function(req, res, next) {
  return service
    .deleteStep(req.session, req.params.trackId, req.params.stepId)
    .then(function(data) {
      res.json(data)
    })
    .catch(next)
})

/**
 * Reports
 */

router.post("/:trackId/report", validation.report, function(req, res, next) {
  return service
    .getReport(req.session, req.params.trackId, req.body)
    .then(function(data) {
      res.json(data)
    })
    .catch(next)
})

module.exports = router
