"use strict"

var timeago = require("timeago.js")
  , logger = require("../util").logger
  , error = require("../error")
  , dbUsers = require("./dataService").users
  , dbTracks = require("./dataService").tracks
  , dbSteps = require("./dataService").steps

/**
 * Tracks
 */

function getTracks(session) {
  return dbTracks.findAsync({ userId: session.userId })
}
module.exports.getTracks = getTracks

function addTrack(session, track) {
  Object.assign(track, { userId: session.userId })
  return dbTracks.insertAsync(track)
}
module.exports.addTrack = addTrack

function updateTrack(session, trackId, track) {
  Object.assign(track, { _id: trackId, userId: session.userId })
  return dbTracks.updateAsync({ _id: trackId }, track)
}
module.exports.updateTrack = updateTrack

function deleteTrack(session, trackId) {
  return dbTracks.removeAsync({ _id: trackId })
}
module.exports.deleteTrack = deleteTrack

/**
 * Steps
 */

function generateValue(generator, type, steps) {
  var identifier = typeof generator === "string" ? generator : generator.identifier
    , now, previous

  switch (identifier) {
    case "COUNT":
      return steps.length + 1
    case "TIME_NOW":
      now = new Date()
      return now.toISOString()
    case "TIME_RELATIVE_PREVIOUS":
      previous = steps.length > 0 ? null : steps[0]
      if (previous) {
        return timeago().format(previous.createdAt.getTime())
      }
      break
    default:
      throw new error.UnknownIdentifier("Unknown identifier: " + identifier)
  }
}

function addValueFromFieldToResult(values, field, steps, inputValues) {
  var key = field.key
    , type = field.type
    , generator = field.generator
    , value

  if (inputValues && key in inputValues) {
    value = inputValues[key]
  }

  value = value || generateValue(generator, type, steps)

  values[key] = value
}

function prepareStep(step) {
  var inputValues = step.values
    , values = {}

  return Promise.all([
    dbTracks.findOneAsync({ _id: step.trackId }),
    dbTracks.find({ userId: step.userId, trackId: step.trackId }).sort({ createdAt: -1 }).execAsync()
  ])
    .then(function (results) {
      var track = results[0]
        , steps = results[1]

      track.inputFields.forEach(function (field) {
        addValueFromFieldToResult(values, field, steps, inputValues)
      })
      track.computedFields.forEach(function (field) {
        addValueFromFieldToResult(values, field, steps)
      })

      step.values = values
      return step
    })
}

function getSteps(session, trackId) {
  return dbSteps.findAsync({ userId: session.userId, trackId: trackId })
}
module.exports.getSteps = getSteps

function addStep(session, trackId, step) {
  Object.assign(step, { userId: session.userId, trackId: trackId })
  return prepareStep(step)
    .then(dbSteps.insertAsync.bind(dbSteps))
}
module.exports.addStep = addStep

function updateStep(session, trackId, stepId, step) {
  Object.assign(step, { _id: stepId, userId: session.userId, trackId: trackId })
  return prepareStep(step)
    .then(dbSteps.updateAsync.bind(dbSteps, { _id: stepId }))
}
module.exports.updateStep = updateStep

function deleteStep(session, trackId, stepId) {
  return dbTracks.removeAsync({ _id: stepId })
}
module.exports.deleteStep = deleteStep
