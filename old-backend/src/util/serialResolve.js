function serialResolve(arraylike) {
  return Array.prototype.reduce.call(
    arraylike,
    function (prev, curr) {
      return prev.then(curr)
    },
    Promise.resolve()
  )
}
module.exports = serialResolve
