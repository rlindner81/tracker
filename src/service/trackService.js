"use strict"

var uuidv4 = require("uuid/v4")
  , logger = require("../util").logger
  , error = require("../error")
  , dbUsers = require("./dataService").users
  , dbTracks = require("./dataService").tracks
  , dbSteps = require("./dataService").steps

/**
 * Tracks
 */

function getTracks(session) {
  throw new error.NotImplementedError()
}
module.exports.getTracks = getTracks

function addTrack(session, track) {
  throw new error.NotImplementedError()
}
module.exports.addTrack = addTrack

function updateTrack(session, trackId, track) {
  throw new error.NotImplementedError()
}
module.exports.updateTrack = updateTrack

function deleteTrack(session, trackId) {
  throw new error.NotImplementedError()
}
module.exports.deleteTrack = deleteTrack

/**
 * Steps
 */

function getSteps(session, trackId) {
  throw new error.NotImplementedError()
}
module.exports.getSteps = getSteps

function addStep(session, trackId, step) {
  throw new error.NotImplementedError()
}
module.exports.addStep = addStep

function updateStep(session, trackId, stepId, step) {
  throw new error.NotImplementedError()
}
module.exports.updateStep = updateStep

function deleteStep(session, trackId, stepId) {
  throw new error.NotImplementedError()
}
module.exports.deleteStep = deleteStep
