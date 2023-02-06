// var args = process.argv.slice(2)

const port = !Object.prototype.hasOwnProperty.call(process.env, "PORT") ? 8000 : parseInt(process.env.PORT)
const trustProxy = !Object.prototype.hasOwnProperty.call(process.env, "TRUST_PROXY")
  ? false
  : process.env.TRUST_PROXY.match(/^\d+$/)
  ? parseInt(process.env.TRUST_PROXY)
  : process.env.TRUST_PROXY
const secret = !Object.prototype.hasOwnProperty.call(process.env, "SESSION_SECRET")
  ? "secret"
  : process.env.SESSION_SECRET
const secure = !Object.prototype.hasOwnProperty.call(process.env, "SESSION_SECURE")
  ? false
  : !!process.env.SESSION_SECURE.match(/^true$/i)

module.exports = {
  server: {
    port,
    trustProxy,
  },
  session: {
    resave: false,
    saveUninitialized: false,
    secret,
    cookie: {
      secure,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    },
  },
}
