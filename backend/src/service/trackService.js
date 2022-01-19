const { promisify } = require("util")
const _ = require("lodash")
const moment = require("moment")
const csvStringify = promisify(require("csv").stringify)
const { ApplicationError } = require("../error")
const { isNull } = require("../util")
const dbTracks = require("./dataService").tracks
const dbSteps = require("./dataService").steps
const dbReports = require("./dataService").reports

/**
 * Tracks
 */

function searchTracks(session, options) {
  let tracks
  if (!Object.prototype.hasOwnProperty.call(options, "name") || options.name === "") {
    return getTracks(session)
  }
  const name = new RegExp(_.escapeRegExp(options.name), "i")

  return dbTracks
    .find({ $or: [{ userId: session.userId }, { public: true }], name })
    .sort({ createdAt: -1 })
    .execAsync()
    .then(result => {
      tracks = result
      return Promise.all(
        tracks.map(track => {
          return dbSteps.countAsync({ trackId: track["_id"] }).then(count => {
            track.stepCount = count
            return track
          })
        })
      )
    })
}
module.exports.searchTracks = searchTracks

function getTracks(session) {
  let tracks
  return dbTracks
    .find({ userId: session.userId })
    .sort({ createdAt: -1 })
    .execAsync()
    .then(result => {
      tracks = result
      return Promise.all(
        tracks.map(track => {
          return dbSteps.countAsync({ trackId: track["_id"] }).then(count => {
            track.stepCount = count
            return track
          })
        })
      )
    })
}
module.exports.getTracks = getTracks

function addTrack(session, track) {
  Object.assign(track, { userId: session.userId })
  return dbTracks.insertAsync(track)
}
module.exports.addTrack = addTrack

function updateTrack(session, trackId, track) {
  return dbTracks
    .findOne({ _id: trackId })
    .execAsync()
    .then(dbTrack => {
      if (dbTrack === null) {
        throw new ApplicationError(404, `Cannot find track ${trackId}`)
      }
      track = _.mergeWith(dbTrack, track, { _id: trackId, userId: session.userId }, (objValue, srcValue, key) => {
        if (["position", "key"].includes(key) && objValue !== undefined && objValue !== null) {
          return objValue
        }
      })
      return dbTracks.updateAsync({ _id: trackId }, track)
    })
    .then(updateCount => {
      if (updateCount === 0) {
        throw new ApplicationError(405, `Could not update track ${trackId}`)
      }
      return track
    })
}
module.exports.updateTrack = updateTrack

function deleteTrack(session, trackId) {
  return dbTracks.removeAsync({ _id: trackId })
}
module.exports.deleteTrack = deleteTrack

/**
 * Steps
 */

function generateValue(track, steps, field) {
  let generator = field.generator
  let parameters = generator && generator.parameters
  let identifier = typeof generator === "string" ? generator : generator.identifier
  let now = moment()
  let previous

  switch (identifier) {
    case "STATIC":
      if (!parameters || !parameters.value) {
        throw new ApplicationError(422, "Static field is missing a value parameter: " + field.key)
      }
      return parameters.value
    case "COUNT":
      if (parameters && parameters.unique) {
        let m = /(year|month|week|day|hour|minute|second)s?/gi.exec(parameters.unique)
        if (m === null) {
          throw new ApplicationError(422, `Unknown unique parameter ${parameters.unique} on field ${field.key}`)
        }
        let aggregationCount = 1
        let anchor = now
        let unique = m[1].toLowerCase()
        for (const step of steps) {
          if (!anchor.isSame(step.createdAt, unique)) {
            anchor = moment(step.createdAt)
            aggregationCount++
          }
        }
        return aggregationCount
      }
      return steps.length + 1
    case "TIME_NOW":
      return now.toISOString()
    case "TIME_RELATIVE_PREVIOUS":
      previous = steps.length > 0 ? steps[0] : null
      if (previous) {
        return moment(previous.createdAt.getTime()).fromNow(true)
      }
      break
    default:
      throw new ApplicationError(422, `Unknown generator: ${identifier} on field ${field.key}`)
  }
}

function addValueFromFieldToResult(track, steps, field, values, inputValues) {
  const key = field.key
  let value

  if (field.input && inputValues && Object.prototype.hasOwnProperty.call(inputValues, key)) {
    value = inputValues[key]
  }

  if (isNull(value) && field.generator) {
    value = generateValue(track, steps, field)
  }

  values[key] = value
}

function convertFieldInputToType(field, inputValues) {
  const key = field.key
  if (!field.input || !inputValues || !Object.prototype.hasOwnProperty.call(inputValues, key)) {
    return
  }
  const type = field.type
  let result = inputValues[key]
  switch (type) {
    case "INPUT":
      break
    case "TEXT":
      if (typeof result !== "string") {
        result = String(result)
      }
      break
    case "INTEGER":
      if (typeof result === "string") {
        result = parseInt(result)
      } else if (typeof result === "number") {
        result = Math.trunc(result)
      }
      break
    case "FLOAT":
      if (typeof result === "string") {
        result = parseFloat(result)
      }
      break
    case "BOOLEAN":
      if (typeof result === "string") {
        result = !!result.match(/true/i)
      } else if (typeof result === "number") {
        result = result === 0
      }
      break
    case "TIME":
      result = moment(result).toISOString()
      break
    case "DEFAULT":
      throw new ApplicationError(500, `Unknown field type ${type} on field ${key}`)
  }
  inputValues[key] = result
}

function prepareStep(step) {
  let inputValues = step.values
  let values = {}

  return Promise.all([
    dbTracks.findOneAsync({ _id: step.trackId }),
    dbSteps
      .find({ userId: step.userId, trackId: step.trackId })
      .sort({ createdAt: -1 })
      .execAsync()
  ]).then(([track, steps]) => {
    if (track === null) {
      throw new ApplicationError(404, "Track not found")
    }

    for (const field of track.fields) {
      convertFieldInputToType(field, inputValues)
      addValueFromFieldToResult(track, steps, field, values, inputValues)
    }

    step.values = values
    return step
  })
}

function getSteps(session, trackId) {
  return dbSteps
    .find({ userId: session.userId, trackId: trackId })
    .sort({ createdAt: -1 })
    .execAsync()
}
module.exports.getSteps = getSteps

function exportSteps(session, trackId) {
  return Promise.all([
    dbTracks.findOneAsync({ _id: trackId }),
    dbSteps
      .find({ userId: session.userId, trackId: trackId })
      .sort({ createdAt: -1 })
      .execAsync()
  ]).then(([track, steps]) => {
    if (track === null) {
      throw new ApplicationError(404, `Track ${trackId} not found`)
    }
    const columns = track.fields.map(field => ({ key: field.key, header: field.name }))
    columns.push({ key: "createdAt", header: "Tracked At" })
    return csvStringify(steps.map(step => ({ ...step.values, createdAt: step.createdAt.toISOString() })), {
      header: true,
      columns
    }).then(data => [track.name, data])
  })
}
module.exports.exportSteps = exportSteps

function getStepsPaged(session, trackId, options) {
  const limit = Object.prototype.hasOwnProperty.call(options, "limit") ? parseInt(options.limit) : 20
  const page = Object.prototype.hasOwnProperty.call(options, "page") ? parseInt(options.page) : 1
  const offset = limit * (page - 1)
  return Promise.all([
    dbSteps.countAsync({ userId: session.userId, trackId: trackId }),
    dbSteps
      .find({ userId: session.userId, trackId: trackId })
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .execAsync()
  ]).then(([count, data]) => {
    const pages = Math.trunc(count / limit) + 1
    return {
      count,
      limit,
      pages,
      page,
      data
    }
  })
}
module.exports.getStepsPaged = getStepsPaged

function addStep(session, trackId, step) {
  Object.assign(step, { userId: session.userId, trackId: trackId })
  return prepareStep(step).then(dbSteps.insertAsync.bind(dbSteps))
}
module.exports.addStep = addStep

function updateStep(session, trackId, stepId, step) {
  return dbSteps
    .findOne({ _id: stepId })
    .execAsync()
    .then(dbStep => {
      if (dbStep === null) {
        throw new ApplicationError(404, `Cannot find step ${stepId} on track ${trackId}`)
      }

      step = _.merge(dbStep, step, { _id: stepId, userId: session.userId, trackId: trackId })
      return dbSteps.updateAsync({ _id: stepId }, step)
    })
    .then(updateCount => {
      if (updateCount === 0) {
        throw new ApplicationError(405, `Could not update step ${stepId} on track ${trackId}`)
      }
      return step
    })
}
module.exports.updateStep = updateStep

function deleteStep(session, trackId, stepId) {
  return dbSteps.removeAsync({ _id: stepId })
}
module.exports.deleteStep = deleteStep

/**
 * Reports
 */

function computeAggregations(steps, interval, inputAggregations) {
  let aggregations = []
  let aggregation = {}
  let aggregationCount = 0
  for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
    let step = steps[stepIndex]
    let anchor = moment(step.createdAt)
    aggregation.startAt = aggregation.startAt || anchor
    aggregationCount++
    for (const { key, type, field } of inputAggregations) {
      let value = Object.prototype.hasOwnProperty.call(aggregation, key) ? aggregation[key] : null
      let stepValue = field && step.values[field]
      switch (type) {
        case "COUNT":
          value = aggregationCount
          break
        case "MIN":
          value = value === null || stepValue < value ? stepValue : value
          break
        case "MAX":
          value = value === null || stepValue > value ? stepValue : value
          break
        case "AVG":
        case "SUM":
          value += stepValue
          break
        default:
          throw new ApplicationError(422, `Unknown aggregation type: ${type} on field ${key}`)
      }
      aggregation[key] = value
    }
    // If this is the last iteration or the _next_ step leaves the interval
    let nextStep = stepIndex !== steps.length - 1 ? steps[stepIndex + 1] : null
    if (!nextStep || !aggregation.startAt.isSame(nextStep.createdAt, interval)) {
      aggregation.endAt = anchor
      for (const { key, type } of inputAggregations) {
        if (type !== "AVG") {
          continue
        }
        aggregation[key] = aggregation[key] / aggregationCount
      }
      aggregations.push(aggregation)
      aggregation = {}
      aggregationCount = 0
    }
  }
  return aggregations
}

function evaluateReport(session, trackId, reportId) {
  return Promise.all([
    dbTracks.findOneAsync({ _id: trackId }),
    dbReports.findOneAsync({ _id: reportId }),
    dbSteps
      .find({ userId: session.userId, trackId: trackId })
      .sort({ createdAt: 1 })
      .execAsync()
  ]).then(([track, report, steps]) => {
    if (track === null) {
      throw new ApplicationError(404, `Track ${trackId} not found`)
    }
    if (report === null) {
      throw new ApplicationError(404, `Report ${reportId} not found`)
    }

    return {
      trackId,
      reportId,
      ...(Object.prototype.hasOwnProperty.call(report, "name") && { name: report.name }),
      aggregations: computeAggregations(steps, report.interval, report.aggregations)
    }
  })
}
module.exports.evaluateReport = evaluateReport

function evaluateDynamicReport(session, trackId, report) {
  return Promise.all([
    dbTracks.findOneAsync({ _id: trackId }),
    dbSteps
      .find({ userId: session.userId, trackId: trackId })
      .sort({ createdAt: 1 })
      .execAsync()
  ]).then(([track, steps]) => {
    if (track === null) {
      throw new ApplicationError(404, `Track ${trackId} not found`)
    }

    return {
      trackId,
      aggregations: computeAggregations(steps, report.interval, report.aggregations)
    }
  })
}
module.exports.evaluateDynamicReport = evaluateDynamicReport

function getReports(session, trackId) {
  return dbReports
    .find({ userId: session.userId, trackId: trackId })
    .sort({ createdAt: -1 })
    .execAsync()
}
module.exports.getReports = getReports

function addReport(session, trackId, report) {
  Object.assign(report, { userId: session.userId, trackId: trackId })
  return dbReports.insertAsync(report)
}
module.exports.addReport = addReport

function deleteReport(session, trackId, reportId) {
  return dbReports.removeAsync({ _id: reportId })
}
module.exports.deleteReport = deleteReport
