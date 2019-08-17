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

* Field types: 
  * `TEXT`
  * `NUMBER` for the moment this covers both floats and integers, same as javascript
  * `TIME` same as TEXT, but is a JS Date in ISO format
  * `SELECT_SINGLE?` could become `ENUM` if we can distinguish single/multiselect via `parameters`
* Generator types:
  * `STATIC` just pass through the `parameters.value` and don't even sweat
  * `COUNT?` this could be change if we can do the same through reporting
    * `parameters.unique` options are `YEAR|MONTH|WEEK|DAY|HOUR|MINUTE|SECOND` via momentjs
  * `TIME_NOW?` this could change as well. every step has an internal createdAt timestamp anyway...
  * `TIME_RELATIVE_PREVIOUS?` mostly for playing around for now
* Report aggregations:
  * `MIN|MAX|AVG|SUM`
* Report intervals:
  * `YEAR|MONTH|WEEK|DAY|HOUR|MINUTE|SECOND`

## API
```
GET    /api/track
POST   /api/track
PATCH  /api/track/:trackId
DELETE /api/track/:trackId

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
              "name": "Good"
            },
            {
              "key": "postive",
              "name": "Postive"
            },
            {
              "key": "bored",
              "name": "Bored"
            },
            {
              "key": "bad",
              "name": "Bad"
            }
          ]
        }
      },
      "generator": {
        "identifier": "STATIC",
        "parameters": {
          "value": "postive"
        }
      }
    },
    {
      "position": 2,
      "key": "count",
      "name": "Count",
      "type": "NUMBER",
      "generator": "COUNT"
    },
    {
      "position": 3,
      "key": "countUniqueDays",
      "name": "CountUniqueDays",
      "type": "NUMBER",
      "generator": {
        "identifier": "COUNT",
        "parameters": {
          "unique": "DAYS"
        }
      }
    },
    {
      "position": 4,
      "key": "createdAt",
      "name": "Created At",
      "type": "TIME",
      "generator": "TIME_NOW"
    },
    {
      "position": 5,
      "key": "gap",
      "name": "Gap",
      "type": "TEXT",
      "generator": "TIME_RELATIVE_PREVIOUS"
    }
  ]
}
```

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
      "mood": "Positive"
      "count": 1,
      "createdAt": "2018-09-06T18:17:00.937Z",
      "gap": null
    }
  },
  {
    "trackId": "...",
    "values": {
      "motivation": "Make another difference",
      "mood": "Bored"
      "count": 2,
      "createdAt": "2018-09-06T19:20:12.937Z",
      "gap": "2 hours"
    }
  }
]
```

```
POST   /api/track/:trackId/report

POST
{
  "values": {
    "count": "SUM"
  }
  "interval": "WEEK"
}
```

## TODO

* Add reporting
* Maybe switch to expressions?
