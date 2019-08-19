function isNull() {
  return hasNull(arguments)
}
module.exports.isNull = isNull

function hasNull(arraylike) {
  return Array.prototype.reduce.call(
    arraylike,
    function(prev, curr) {
      return prev || curr === null || curr === undefined
    },
    false
  )
}
module.exports.hasNull = hasNull
