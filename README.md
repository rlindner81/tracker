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
* [BCrypt](https://www.npmjs.com/package/bcrypt) for secure password storage
* [Joi](https://www.npmjs.com/package/joi) for request validation
* [UUID](https://www.npmjs.com/package/uuid) for generating version 4 UUIDs

## Codestyle

* Code will be in [ECMAScript 5.1](https://www.ecma-international.org/ecma-262/5.1/) published in June 2011
* Style rules are specfied in [ESLint](.eslintrc.yml)

## API
```
GET    /api/track
POST   /api/track
PATCH  /api/track/:trackId
DELETE /api/track/:trackId

[
  {
    "_id": "b90c3b7d-a0a4-4d5d-b537-1cec064d7870",
    "title": "Willpower",
    "fields": [
      {
        "key": "count",
        "name": "Count",
        "editable": false,
        "generator": {
          "type: "ENUMERATE",
          "parameters": {
            "start": 1,
            "step": 1
          }
        }
      },
      {
        "key": "createdAt",
        "name": "Created At",
        "editable": false,
        "generator": {
          "type": "TIME"
        }
      },
      {
        "key": "gap",
        "name": "Gap",
        "editable": false,
        "generator": {
          "type": "PREVIOUS_STEP",
          "parameters": {
            "field": "createdAt"
          }
        },
        "formatter: "TIME_RELATIVE"
      },
      {
        "key": "motivation",
        "name": "Motivation",
        "editable": true,
        "generator": {
          "type": "STATIC",
          "parameters": {
            "value": "Make a difference today"
          }
        }
      }
    ]
  }
]

GET    /api/track/:trackId/step
POST   /api/track/:trackId/step
PATCH  /api/track/:trackId/step/:stepId
DELETE /api/track/:trackId/step/:stepId

[
  {
    "_id": "12f16191-40f4-45b9-b8b8-90af8351415f",
    "trackId": "b90c3b7d-a0a4-4d5d-b537-1cec064d7870",
    "values": [
      "1",
      "2018-09-06T18:11:26.123Z",
      null,
      "Make a difference today"
    ]
  },
  {
    "_id": "1baa86ed-3520-45e4-a0e5-52fbbf23aad2",
    "trackId": "b90c3b7d-a0a4-4d5d-b537-1cec064d7870",
    "values": [
      "2",
      "2018-09-06T18:17:00.937Z",
      "6 seconds",
      "Keep it rolling"
    ]
  }
]
```

## TODO

* Maybe switch to expressions?
