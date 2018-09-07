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

POST
{
  "name": "Willpower",
  "inputFields": [
    {
      "position": 0,
      "key": "motivation",
      "name": "Motivation",
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
      "type": {
        "identifier": "SELECT_SINGLE",
        "parameters": {
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
    }
  ],
  "computedFields": [
    {
      "position": 2,
      "key": "count",
      "name": "Count",
      "type": "NUMBER",
      "generator": {
        "identifier": "ENUMERATE",
        "parameters": {
          "start": 1,
          "step": 1
        }
      }
    },
    {
      "position": 3,
      "key": "createdAt",
      "name": "Created At",
      "type": "TIME",
      "generator": "TIME_NOW"
    },
    {
      "position": 4,
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
PATCH  /api/track/:trackId/step/:stepId
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

## TODO

* Implement POST /step without computedFields
* Should probably unify fields again... they are not that different or maybe they are for the frontend?
* Add field type ENUMERATE
* Add field type TIME_NOW
* Maybe switch to expressions?
