"use strict"

var logger = require("../util").logger
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

function prepareStep(step) {

}

function getSteps(session, trackId) {
  return dbSteps.findAsync({ userId: session.userId, trackId: trackId })
}
module.exports.getSteps = getSteps

function addStep(session, trackId, step) {
  Object.assign(step, { userId: session.userId, trackId: trackId })
  prepareStep(step)
  return dbSteps.insertAsync(step)
}
module.exports.addStep = addStep

function updateStep(session, trackId, stepId, step) {
  Object.assign(step, { _id: stepId, userId: session.userId, trackId: trackId })
  prepareStep(step)
  return dbSteps.updateAsync({ _id: stepId }, step)
}
module.exports.updateStep = updateStep

function deleteStep(session, trackId, stepId) {
  return dbTracks.removeAsync({ _id: stepId })
}
module.exports.deleteStep = deleteStep
