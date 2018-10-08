"use strict"

// var args = process.argv.slice(2)

module.exports = {
  server: {
    port: process.env.PORT || 8000,
    trustProxy: process.env.TRUST_PROXY || false
  },
  session: {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "secret",
    cookie: {
      secure: process.env.SESSION_SECURE || false,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    }
  }
}
