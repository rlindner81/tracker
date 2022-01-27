const ApplicationError = require("./ApplicationError")

module.exports = function (err, req, res, next) {
  if (err instanceof ApplicationError) {
    return res.status(err.status).send(err.message)
  }

  next(err)
}
