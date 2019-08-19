var moment = require("moment"),
  ApplicationError = require("../error").ApplicationError,
  dbTracks = require("./dataService").tracks,
  dbSteps = require("./dataService").steps

/**
 * Tracks
 */

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
        throw new ApplicationError(404, `Cannot find track with id ${trackId}`)
      }
      track = Object.assign({}, dbTrack, track, { _id: trackId, userId: session.userId })
      return dbTracks.updateAsync({ _id: trackId }, track)
    })
    .then(updateCount => {
      if (updateCount === 0) {
        throw new ApplicationError(404, `Could not update track with id ${trackId}`)
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
  var generator = field.generator,
    parameters = generator && generator.parameters,
    identifier = typeof generator === "string" ? generator : generator.identifier,
    now = moment(),
    previous

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
  var key = field.key,
    value

  if (field.input && inputValues && key in inputValues) {
    value = inputValues[key]
  }

  value = value || generateValue(track, steps, field)

  values[key] = value
}

function prepareStep(step) {
  var inputValues = step.values,
    values = {}

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

    track.fields.forEach(function(field) {
      addValueFromFieldToResult(track, steps, field, values, inputValues)
    })

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

function getStepsPaged(session, trackId, options) {
  const limit = "limit" in options ? parseInt(options.limit) : 20
  const page = "page" in options ? parseInt(options.page) : 1
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

// If we ever uncomment this. Make it a real PATCH not a PUT
// function updateStep(session, trackId, stepId, step) {
//   Object.assign(step, { _id: stepId, userId: session.userId, trackId: trackId })
//   return prepareStep(step).then(dbSteps.updateAsync.bind(dbSteps, { _id: stepId }))
// }
// module.exports.updateStep = updateStep

function deleteStep(session, trackId, stepId) {
  return dbTracks.removeAsync({ _id: stepId })
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
      let value = key in aggregation ? aggregation[key] : null
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

function getReport(session, trackId, report) {
  return Promise.all([
    dbTracks.findOneAsync({ _id: trackId }),
    dbSteps
      .find({ userId: session.userId, trackId: trackId })
      .sort({ createdAt: 1 })
      .execAsync()
  ]).then(([track, steps]) => {
    if (track === null) {
      throw new ApplicationError(404, "Track not found")
    }

    return {
      trackId,
      aggregations: computeAggregations(steps, report.interval, report.aggregations)
    }
  })
}
module.exports.getReport = getReport
