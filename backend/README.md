# Tracker

This is the Javascript backend for the ultimate tracker.

## Dependencies

You will need at least [NodeJS](https://nodejs.org) 10.x.

* [Express](https://www.npmjs.com/package/express) for routering and low-level request handling
  * [Body-Parser](https://www.npmjs.com/package/body-parser) to parse request bodies in `req.body` 
  * [Express-Session](https://www.npmjs.com/package/express-session) for handling sessions via `req.session` 
* [NeDB](https://www.npmjs.com/package/nedb) as an embedded document database
  * [NeDB-Session-Store](https://www.npmjs.com/package/nedb-session-store) session NeDB backend
* [Winston](https://www.npmjs.com/package/winston) for all logging
* [BCrypt](https://www.npmjs.com/package/bcrypt) for secure password storage
* [Joi](https://www.npmjs.com/package/@hapi/joi) for request validation
* [UUID](https://www.npmjs.com/package/uuid) for generating version 4 UUIDs
* [moment](https://www.npmjs.com/package/moment) for getting relative times

## Codestyle

* Code will be in [ECMAScript 2018](http://www.ecma-international.org/ecma-262/9.0/)
* Style rules are specfied in [ESLint](.eslintrc.yml)

## Indentifiers
Marked with `?` means it could change/be removed.

### Field types
Field type conversion happens when a step is saved. Expected inputs are all basic types JSON allows.
* `INPUT` leave as is
* `TEXT` convert to text
* `INTEGER` convert with `parseInt`
* `FLOAT` convert with `parseFloat`
* `TIME` convert to JS Date

### Input types
This defines the input interface for each step entry.
* `FIELD`
* `SELECT?`

### Display types
This defines the way the field information is displayed to the user.
For example if we know a field to be currency, we could add a suffix here so that instead of just the number they see `123,00€`.
* `CURRENCY?`

### Generator types
* `STATIC` just pass through the `parameters.value` and don't even sweat
* `TIME_NOW?` this could change as well. every step has an internal createdAt timestamp anyway...
* `TIME_RELATIVE_PREVIOUS?` mostly for playing around for now

### Report
* aggregations: `COUNT|MIN|MAX|AVG|SUM`
* intervals: `YEAR|MONTH|WEEK|DAY|HOUR|MINUTE|SECOND`

## API

### Track
```
# Normal REST handling of tracks
GET    /api/track
POST   /api/track
PATCH  /api/track/:trackId
DELETE /api/track/:trackId

# Search public tracks
GET    /api/track/$search?name=lalala

POST
{
  "name": "Willpower",
  "fields": [
    {
      "position": 0,
      "key": "motivation",
      "name": "Motivation",
      "input": true,
      "type": "TEXT",
      "generator": {
        "identifier": "STATIC",
        "parameters": {
          "value": "Make a difference today"
        }
      }
    },
    {
      "position": 1,
      "key": "mood",
      "name": "Mood",
      "input": true,
      "type": {
        "identifier": "SELECT_SINGLE",
        "parameters": {
          "selected": "good",
          "values": [
            {
              "key": "good",
              "name": "Good",
              "value": 1
            },
            {
              "key": "postive",
              "name": "Postive",
              "value": 2
            },
            {
              "key": "bored",
              "name": "Bored",
              "value": -1
            },
            {
              "key": "bad",
              "name": "Bad",
              "value": -2
            }
          ]
        }
      },
      "generator": {
        "identifier": "STATIC",
        "parameters": {
          "value": 1
        }
      }
    },
    {
      "position": 2,
      "key": "createdAt",
      "name": "Created At",
      "type": "TIME",
      "generator": "TIME_NOW"
    },
    {
      "position": 3,
      "key": "gap",
      "name": "Gap",
      "type": "TEXT",
      "generator": "TIME_RELATIVE_PREVIOUS"
    }
  ]
}
```

### Track/Step
```
GET    /api/track/:trackId/step
POST   /api/track/:trackId/step
DELETE /api/track/:trackId/step/:stepId

POST
{
  "values": {}
}

POST
{
  "values": {
    "motivation": "Make another difference",
    "mood": "bored"
  }
}

GET
[
  {
    "trackId": "...",
    "values": {
      "motivation": "Make a difference today",
      "mood": 1
      "createdAt": "2018-09-06T18:17:00.937Z",
      "gap": null
    }
  },
  {
    "trackId": "...",
    "values": {
      "motivation": "Make another difference",
      "mood": -1
      "createdAt": "2018-09-06T19:20:12.937Z",
      "gap": "2 hours"
    }
  }
]
```

### Track/Report
```
# Normal REST handling of report definitions
GET    /api/track/:trackId/report
POST   /api/track/:trackId/report
DELETE /api/track/:trackId/report/:reportId

# Evaluate all my reports and send the results
GET    /api/track/:trackId/report/$evaluate
# Evaluate a dynamic report and send the results
POST   /api/track/:trackId/report/$dynamic

# Report definition
{
  "name": "Moods",
  "aggregations": [
    {
      "key": "count",
      "type": "COUNT"
    },
    {
      "key": "avgMood",
      "type": "AVG",
      "field": "mood"
    },
    {
      "key": "maxMood",
      "type": "MAX",
      "field": "mood"
    }
  ],
  "interval": "WEEK"
}

# Report result
{
  "name": "Moods",
  "reportId": "...",
  "trackId": "...",
  "aggregations": [
    {
      "count": 1,
      "avgMood": 1.5,
      "maxMood": 2,
      "startAt": "2018-09-06T18:17:00.937Z",
      "endAt": "2018-09-06T18:17:00.937Z"
    }
  ]
}
```

### Track/Step/Paged
```
GET    /api/track/:id/steps/$paged?limit=20&page=2
{
  "count": 1000,
  "limit": 20,
  "pages": 50,
  "page": 2,
  "data": [...]
}
```

## TODO

* Tracks get field public and frequency, which are PATCH changeable
* Update example with newest codelists
* Key fields should allow underscore `joi.string().token()`
* Persist reports per user per track
* Public tracks search API for name field
* Problem: SELECT hides the actual type of the input
* Maybe switch to expressions?
