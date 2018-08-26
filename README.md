# Tracker

This is the Javascript backend for the ultimate tracker.

## Dependencies

You will need at least [NodeJS](https://nodejs.org) 8.x.

* [Express](https://www.npmjs.com/package/express) for routering and low-level request handling
  * [Body-Parser](https://www.npmjs.com/package/body-parser) to parse request bodies in `req.body` 
  * [Express-Session](https://www.npmjs.com/package/express-session) for handling sessions via `req.session` 
* [NeDB](https://www.npmjs.com/package/nedb) as an embedded document database
  * [NeDB-Session-Store](https://www.npmjs.com/package/nedb-session-store) session NeDB backend
* [Winston](https://www.npmjs.com/package/winston) for all logging
* [Joi](https://www.npmjs.com/package/joi) for request validation
* [UUID](https://www.npmjs.com/package/uuid) for generating version 4 UUIDs

## Codestyle

* Code will be in [ECMAScript 5.1](https://www.ecma-international.org/ecma-262/5.1/) published in June 2011
* Style rules are specfied in [ESLint](.eslintrc.yml)

<!-- ## Config -->

## TODO

* Setup project
