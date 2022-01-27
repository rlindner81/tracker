const express = require("express")
const validation = require("../validation")
const service = require("../service").track
const router = express.Router()

/**
 * Tracks
 */

router.get("/\\$search", function (req, res, next) {
  return service
    .searchTracks(req.session, req.query)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

router.get("/", function (req, res, next) {
  return service
    .getTracks(req.session)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

router.post("/", validation.track, function (req, res, next) {
  return service
    .addTrack(req.session, req.body)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

router.patch("/:trackId", validation.trackUpdate, function (req, res, next) {
  return service
    .updateTrack(req.session, req.params.trackId, req.body)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

router.delete("/:trackId", function (req, res, next) {
  return service
    .deleteTrack(req.session, req.params.trackId)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

/**
 * Steps
 */

router.get("/:trackId/step/\\$export", function (req, res, next) {
  return service
    .exportSteps(req.session, req.params.trackId)
    .then(([name, data]) => {
      res.set("Content-Type", "text/csv")
      res.set("Content-Disposition", `attachment;filename="${name}.csv"`)
      res.send(data)
    })
    .catch(next)
})

router.get("/:trackId/step/\\$paged", function (req, res, next) {
  return service
    .getStepsPaged(req.session, req.params.trackId, req.query)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

router.get("/:trackId/step", function (req, res, next) {
  return service
    .getSteps(req.session, req.params.trackId)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

router.post("/:trackId/step", validation.step, function (req, res, next) {
  return service
    .addStep(req.session, req.params.trackId, req.body)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

router.patch("/:trackId/step/:stepId", validation.step, function (req, res, next) {
  return service
    .updateStep(req.session, req.params.trackId, req.params.stepId, req.body)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

router.delete("/:trackId/step/:stepId", function (req, res, next) {
  return service
    .deleteStep(req.session, req.params.trackId, req.params.stepId)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

/**
 * Reports
 */

router.get("/:trackId/report/:reportId/\\$evaluate", function (req, res, next) {
  return service
    .evaluateReport(req.session, req.params.trackId, req.params.reportId)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

router.post("/:trackId/report/\\$dynamic", validation.report, function (req, res, next) {
  return service
    .evaluateDynamicReport(req.session, req.params.trackId, req.body)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

router.get("/:trackId/report/", function (req, res, next) {
  return service
    .getReports(req.session, req.params.trackId)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

router.post("/:trackId/report/", validation.report, function (req, res, next) {
  return service
    .addReport(req.session, req.params.trackId, req.body)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})
router.delete("/:trackId/report/:reportId", function (req, res, next) {
  return service
    .deleteReport(req.session, req.params.trackId, req.params.reportId)
    .then(function (data) {
      res.json(data)
    })
    .catch(next)
})

module.exports = router
